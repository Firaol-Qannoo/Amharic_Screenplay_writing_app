import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { selectcharacters } from "../../features/Characters"
import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';


// {
//   id: "1",
//   name: "አበበ",
//   role: "ዋና ገጸ ባህሪ",
//   relationships: [
//     { to: "2", type: "ባል", strength: 5 },
//     { to: "3", type: "አባት", strength: 4 },
//     { to: "5", type: "ወንድም", strength: 3 },
//   ],
// },
// {
//   id: "2",
//   name: "አልማዝ",
//   role: "ዋና ገጸ ባህሪ",
//   relationships: [
//     { to: "1", type: "ሚስት", strength: 5 },
//     { to: "3", type: "እናት", strength: 4 },
//     { to: "4", type: "ጠላት", strength: 2 },
//   ],
// },


export function CharacterNetwork() {
  const characters = useSelector(selectcharacters)
  const canvasRef = useRef(null);

  const nodes = characters.map((char, index) => ({
    id: char.id,
    data: { label: char.name },
    position: {
      x: 100 + 300 * Math.cos((2 * Math.PI * index) / characters.length),
      y: 100 + 300 * Math.sin((2 * Math.PI * index) / characters.length),
    },
    style: { padding: 10, borderRadius: 12, background: '#fff' }
  }));


  const edgeMap = new Set();
  const edges = [];

  characters.forEach((char) => {
    (char.relationships || []).forEach((rel) => {
      const forwardId = `${char.id}-${rel.to}`;
      const reverseId = `${rel.to}-${char.id}`;

 
      if (!edgeMap.has(forwardId)) {
        edges.push({
          id: forwardId,
          source: char.id,
          target: rel.to,
          label: rel.type,
          animated: true,
          style: { stroke: '#1d4ed8' },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: 'white', color: '#1d4ed8' }
        });
        edgeMap.add(forwardId);
      }

      if (!edgeMap.has(reverseId)) {
        edges.push({
          id: reverseId,
          source: rel.to,
          target: char.id,
          label: rel.type,
        animated: true,
          style: { stroke: '#9333ea' },
          labelBgStyle: { fill: 'white', color: '#9333ea' }
        });
        edgeMap.add(reverseId);
      }
    
    });
  });

  return (
    <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
      <ReactFlow nodes={nodes} edges={edges} fitView style={{ position: 'relative', zIndex: 1 }}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}