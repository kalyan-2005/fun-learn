// "use client";

// import React, { useState, useRef } from "react";
// import ReactDOM from "react-dom";
// import { Piece } from "avataaars";
// import Avatar from "avataaars";
// import map from "lodash/map";
// import options from "./options";
// import toast from "react-hot-toast";

// import {
//   Button,
//   DownloadRow,
//   Tabs,
//   Tabpanes,
//   ColorContainer,
//   Container,
//   StyledAvatar,
//   Pieces,
//   Color,
//   None,
//   Tab,
//   Tabpane,
// } from "./style";
// import useDiamondsStore from "@/hooks/useDiamondsStore";
// import Image from "next/image";
// import useAvatarStore from "@/hooks/useAvatarStore";

// export default function Avataaar(props) {
//   const canvasRef = useRef(null);
//   const avatarRef = useRef(null);
//   const [selectedTab, setSelectedTab] = useState("top");
//   const { diamonds, setDiamonds } = useDiamondsStore();
//   const { setAvatar } = useAvatarStore();

//   const pieceClicked = (attr, val) => {
//     var newAttributes = {
//       ...props.value,
//       [attr]: val,
//     };
//     if (props.onChange) {
//       props.onChange(newAttributes);
//     }
//   };

//   const triggerDownload = async (imageBlob, fileName) => {
//     try {
//       if (diamonds < 20) {
//         toast.error("You need at least 20 diamonds to upload an avatar");
//         return;
//       }
//       toast.loading("Uploading avatar...");
//       const response = await fetch(`/api/avatar/upload?filename=${fileName}`, {
//         method: "POST",
//         body: imageBlob,
//       });
//       const newBlob = await response.json();
//       setAvatar(newBlob.url);
//       setDiamonds(diamonds - 20);
//       toast.dismiss();
//       toast.success("Avatar uploaded successfully");
//     } catch (error) {
//       toast.dismiss();
//       toast.error("Error uploading avatar");
//     }
//   };

//   const onDownloadPNG = () => {
//     // eslint-disable-next-line react/no-find-dom-node
//     const svgNode = ReactDOM.findDOMNode(avatarRef.current);
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const anyWindow = window;
//     const DOMURL = anyWindow.URL || anyWindow.webkitURL || window;

//     const data = svgNode.outerHTML;
//     const img = new Image();
//     const svg = new Blob([data], { type: "image/svg+xml" });
//     const url = DOMURL.createObjectURL(svg);

//     img.onload = () => {
//       ctx.save();
//       ctx.scale(2, 2);
//       ctx.drawImage(img, 0, 0);
//       ctx.restore();
//       DOMURL.revokeObjectURL(url);
//       canvasRef.current.toBlob((imageBlob) => {
//         triggerDownload(imageBlob, "avatar.png");
//       });
//     };
//     img.src = url;
//   };

//   const onDownloadSVG = () => {
//     // eslint-disable-next-line react/no-find-dom-node
//     const svgNode = ReactDOM.findDOMNode(avatarRef.current);
//     const data = svgNode.outerHTML;
//     const svg = new Blob([data], { type: "image/svg+xml" });
//     triggerDownload(svg, "avatar.svg");
//   };

//   return (
//     <Container>
//       <StyledAvatar>
//         <Avatar
//           ref={avatarRef}
//           style={{ width: "200px", height: "200px" }}
//           {...props.value}
//         />
//       </StyledAvatar>
//       <Tabs>
//         {map(options, (option) => {
//           return (
//             <Tab
//               selectedTab={selectedTab}
//               type={option.type}
//               onClick={() => setSelectedTab(option.type)}
//             >
//               {option.label}
//             </Tab>
//           );
//         })}
//       </Tabs>
//       <Tabpanes>
//         {options.map((option) => {
//           return (
//             <Tabpane
//               selectedTab={selectedTab}
//               type={option.type}
//               key={option.type}
//             >
//               {option.values.map((val) => {
//                 var attr = {};
//                 attr[option.attribute] = val;
//                 if (option.transform) {
//                   attr.style = { transform: option.transform };
//                 }
//                 return (
//                   <Pieces
//                     onClick={() => pieceClicked(option.attribute, val)}
//                     key={val}
//                   >
//                     {option.type === "avatarStyle" ? (
//                       <span style={{ margin: "5px" }}>{val}</span>
//                     ) : (
//                       <Piece pieceSize="50" pieceType={option.type} {...attr} />
//                     )}
//                     {(val === "Blank" || val === "NoHair") && (
//                       <None>(none)</None>
//                     )}
//                   </Pieces>
//                 );
//               })}
//               <ColorContainer>
//                 {option.colors &&
//                   (option.type !== "top" ||
//                     option.hats.indexOf(props.value.topType) === -1) &&
//                   props.value.topType !== "Eyepatch" &&
//                   props.value.topType !== "LongHairShavedSides" &&
//                   props.value.topType !== "LongHairFrida" &&
//                   map(option.colors, (color, colorName) => {
//                     return (
//                       <Color
//                         style={{
//                           backgroundColor: color,
//                           border:
//                             color === "#FFFFFF"
//                               ? "1px solid #ccc"
//                               : "1px solid " + color,
//                         }}
//                         onClick={() =>
//                           pieceClicked(option.colorAttribute, colorName)
//                         }
//                       ></Color>
//                     );
//                   })}

//                 {option.hatColors &&
//                   option.hats.indexOf(props.value.topType) !== -1 &&
//                   props.value.topType !== "Hat" &&
//                   map(option.hatColors, (color, colorName) => {
//                     return (
//                       <Color
//                         style={{
//                           backgroundColor: color,
//                           border:
//                             color === "#FFFFFF"
//                               ? "1px solid #ccc"
//                               : "1px solid " + color,
//                         }}
//                         onClick={() => pieceClicked("hatColor", colorName)}
//                       ></Color>
//                     );
//                   })}
//               </ColorContainer>
//             </Tabpane>
//           );
//         })}
//       </Tabpanes>
//       <div
//         onClick={onDownloadSVG}
//         className="flex justify-center align-middle gap-2 w-[200px] mx-auto font-semibold bg-indigo-800 text-white p-2 rounded-lg cursor-pointer"
//       >
//         Set As Avatar
//         <div className="flex items-center gap-1 text-lg font-semibold ">
//           20 <Image src="/diamond.png" width={20} height={20} alt="diamond" />
//         </div>
//       </div>
//       <canvas
//         style={{ display: "none" }}
//         width="528"
//         height="560"
//         ref={canvasRef}
//       />
//     </Container>
//   );
// }

import React from 'react'

function Avatar() {
  return (
    <div>Avatar</div>
  )
}

export default Avatar