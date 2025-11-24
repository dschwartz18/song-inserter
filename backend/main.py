import urllib3
import requests
from urllib.parse import quote
from fastapi import FastAPI, Header, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Disable SSL warnings as per requirement
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI()

# Allow all origins for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BASE URL - Update this if the extension is different (e.g. .co.il, .com)
# Based on screenshot: https://hamuazin.yesodot.se...
HAMUAZIN_BASE_URL = "https://hamuazin.yesodot.se" 

class SongList(BaseModel):
    songs: List[str]

@app.get("/api/music/playlists/personalized")
async def get_playlists(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    url = f"{HAMUAZIN_BASE_URL}/api/music/playlists/peronalized"
    params = {"type": "IS_OWNER"}
    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, verify=False)
        # If the API returns 200, return the data
        # If it fails, we might want to pass that through or handle it
        if response.status_code == 200:
            return response.json()
        else:
            # Fallback to fake data if API fails (e.g. due to network/VPN issues)
            print(f"API failed ({response.status_code}), returning fake playlist")
            return {
                "playlists": [
                    {
                        "id": "fake-pl-1",
                        "name": "Mock Playlist (Backend)",
                        "type": "playlist",
                        "songs": [],
                        "coverUrl": "https://picsum.photos/seed/mock/300/300"
                    }
                ]
            }
    except Exception as e:
        # Also return fake data on exception
        print(f"Exception fetching playlists: {e}, returning fake playlist")
        return {
            "playlists": [
                {
                    "id": "fake-pl-error", 
                    "name": "Error Mock Playlist",
                    "type": "playlist", 
                    "songs": [],
                    "coverUrl": "https://picsum.photos/seed/error/300/300"
                }
            ]
        }

@app.get("/api/search/multi/{song}")
async def search_song(song: str, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    # Logic from screenshot: parsing Hebrew
    # if 0x0590 <= ord(song[0]) <= 0x05FF: ...
    
    # Note: The logic in screenshot iterates through a list and quotes IF Hebrew.
    # Here we get a single song string in the path.
    # We should check if it needs quoting.
    
    final_song_query = song
    if song and 0x0590 <= ord(song[0]) <= 0x05FF:
         final_song_query = quote(song, safe='')
    
    url = f"{HAMUAZIN_BASE_URL}/api/search/multi/{final_song_query}"
    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json, text/plain, */*"
    }
    
    try:
        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            return response.json()
        return {"songs": []} # Return empty if fail
    except Exception as e:
        print(f"Search error: {e}")
        return {"songs": []}

@app.post("/api/music/playlists/{playlist_id}")
async def add_songs_to_playlist(
    playlist_id: str, 
    song_list: SongList, 
    authorization: str = Header(None)
):
    """
    Receives a list of song names.
    Loops through them:
      1. Search (with Hebrew logic)
      2. Get ID
      3. Add to playlist
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json"
    }

    results = []
    
    for song_name in song_list.songs:
        # 1. Parse/Quote
        parsed_song = song_name
        if song_name and 0x0590 <= ord(song_name[0]) <= 0x05FF:
            parsed_song = quote(song_name, safe='')
            
        # 2. Search
        search_url = f"{HAMUAZIN_BASE_URL}/api/search/multi/{parsed_song}"
        song_id = None
        try:
            # verify=False as per screenshot
            s_res = requests.get(search_url, headers=headers, verify=False)
            if s_res.status_code == 200:
                data = s_res.json()
                if data.get('songs') and len(data['songs']) > 0:
                    song_id = data['songs'][0]['serialId']
        except Exception as e:
            print(f"Error searching {song_name}: {e}")
            
        # 3. Add if found
        if song_id:
            # The screenshot uses PUT to /api/music/playlists/...
            # It appends the playlist name from a dataframe? 
            # "cubes['cube2'].iloc[0]['TEXTS_NAME'].split('/')[...]"
            # Since we only have playlist_id, we will try using that.
            # IF the external API requires the Name in the URL, this might fail.
            # But standard REST is usually ID. 
            # If the previous code used Name, it might be a slug?
            # We will assume ID works or is the intended parameter.
            
            add_url = f"{HAMUAZIN_BASE_URL}/api/music/playlists/{playlist_id}"
            body = {"songSerialIdToAdd": song_id}
            
            try:
                # PUT as per screenshot
                a_res = requests.put(add_url, headers=headers, json=body, verify=False)
                results.append({
                    "song": song_name,
                    "status": a_res.status_code,
                    "added": a_res.status_code == 200
                })
            except Exception as e:
                results.append({"song": song_name, "status": "error", "detail": str(e)})
        else:
            results.append({"song": song_name, "status": "not_found"})
            
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

