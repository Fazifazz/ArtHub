import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ServerVariables } from "../../util/ServerVariables";
import socket from "../../components/SocketIo";
import toast from "react-hot-toast";

function ArtistVideoCallRoom() {
    const { roomId,userId } = useParams();
    const { artist } = useSelector((state) => state.ArtistAuth);
    const meeting = useRef(null);
  
    useEffect(() => {
      const initZego = async () => {
        const appID = 2072621261;
        const serverSecret = "eaf046debc960028684c90c2d219cfe3";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          Date.now().toString(),
          artist?.name
        );
  
        const zp = ZegoUIKitPrebuilt.create(kitToken);
  
        zp.joinRoom({
          container: meeting.current,
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
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: false,
          onJoinRoom: () => {
            socket.emit("videoCallInvitation", {
              sender: artist,
              link:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomId,
                userId,
            });
          },
          onLeaveRoom:()=>{
            window.history.back();
          }
        });
  
        // Save the Zego instance to the ref
        meeting.current = zp;
      };
  
      initZego();
  
      // Cleanup function
      return () => {
        window.location.reload();
      };
    }, [roomId, artist?.name]);
  
    useEffect(() => {
      socket.on("videoCallResponse", (data) => {
        console.log('data',data)
        if (!data.accepted) {
         toast.error('call rejected by artist',{duration:5000})
        }
      });
    
      return () => {
        socket.off("videoCallResponse");
      };
    }, []);

  return (
    <>
      <div className="flex-grow flex-shrink min-h-screen">
        {" "}
        <div ref={meeting} />
      </div>
    </>
  );
}

export default ArtistVideoCallRoom;
