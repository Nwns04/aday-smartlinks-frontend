import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import API from '../../services/api';

export default function ABTestBuilder({ campaignId }) {
  const [tests, setTests] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    API.get(`/campaigns/${campaignId}/tests`)
      .then(r => {
        setTests(r.data);
        if (r.data.length) setActive(r.data[0]);
      });
  }, [campaignId]);

  const onDragEnd = (res) => {
    if (!res.destination) return;
    const { source, destination } = res;
    const vIdx = active.variants.findIndex(v => v.key === res.type);
    const blocks = Array.from(active.variants[vIdx].blocks);
    const [moved] = blocks.splice(source.index, 1);
    blocks.splice(destination.index, 0, moved);
    const updated = {
      ...active,
      variants: active.variants.map(v =>
        v.key === res.type ? { ...v, blocks } : v
      )
    };
    setActive(updated);
  };

  const save = () => {
    API.patch(`/campaigns/tests/${active._id}`, { variants: active.variants })
       .then(r => alert('Saved!'));
  };

  if (!active) return <p>Loading A/B tests…</p>;

  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      <h3 className="col-span-2 text-lg font-semibold mb-2">A/B Test: {active.name}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        {active.variants.map(variant => (
          <Droppable key={variant.key} droppableId={variant.key} type={variant.key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white p-4 rounded shadow space-y-2"
              >
                <h4 className="font-medium mb-2">Variant {variant.key}</h4>
                {variant.blocks.map((block, idx) => (
                  <Draggable key={idx} draggableId={`${variant.key}-${idx}`} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-2 border rounded bg-gray-50"
                      >
                        {block}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <button
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={() => {
                    const text = prompt('Enter new block HTML/text');
                    if (!text) return;
                    setActive(a => ({
                      ...a,
                      variants: a.variants.map(v =>
                        v.key === variant.key
                          ? { ...v, blocks: [...v.blocks, text] }
                          : v
                      )
                    }));
                  }}
                >
                  + Add Block
                </button>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <div className="col-span-2 flex justify-end">
        <button
          onClick={save}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Variants
        </button>
      </div>
    </div>
  );
}
