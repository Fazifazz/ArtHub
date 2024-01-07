import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function VideoCallRoom() {
  const { roomId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const { artist } = useSelector(state=>state.ArtistAuth)

  useEffect(() => {
    const myMeeting = async (element) => {
      const appID = 2072621261;
      const serverSecret = "eaf046debc960028684c90c2d219cfe3";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        `${artist.name}`
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomId,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        showScreenSharingButton: false,
      });
    };
    setMeeting(myMeeting);

    return ()=>{
      window.location.reload()
  }
  }, []);

  return (
    <>
      <div className="flex-grow flex-shrink min-h-screen">
        <div ref={meeting} />
      </div>
    </>
  );
}

export default VideoCallRoom;