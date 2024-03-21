import * as React from 'react';
import './Chip.css';
import Draggable from 'react-draggable';

export function Chip({
    chip, index, activeChips, 
    addChip, mergeChip, setChipPosition
}: {
    chip: {name: string, x: number, y: number}, 
    index:number, 
    activeChips: {name: string, x: number, y: number}[], 
    addChip: (name: string, x: number, y: number) => void,
    mergeChip: (index1: number, index2: number) => void, 
    setChipPosition: (index: number, x: number, y: number) => void
}) {

    const ref = React.useRef(null)
    const [height, setHeight] = React.useState(0)
    const [width, setWidth] = React.useState(0)

    React.useEffect(() => {
        if (ref.current) {
            setHeight((ref.current as HTMLElement).clientHeight);
            setWidth((ref.current as HTMLElement).clientWidth);
        }
    }, [ref.current])

    const onDrag = (e: any) => {
        const centerX = e.x + width/2;
        const centerY = e.y + height/2;
        const minX = centerX - width/2;
        const minY = centerY - height/2;
        const maxX = centerX + width/2;
        const maxY = centerY + height/2;
        activeChips.forEach((chip, i) => {
            const chipCenterX = chip.x + width/2;
            const chipCenterY = chip.y + height/2;
            if (i !== index) {
                if (chipCenterX > minX && chipCenterX < maxX && chipCenterY > minY && chipCenterY < maxY) {
                    mergeChip(index, i);
                }
            }
        }
        );
    }

    const onStop = (e: any) => {
        setChipPosition(index, e.x, e.y);
    }

    return (
        <Draggable bounds="parent" onDrag={onDrag} defaultPosition={{x: chip.x, y: chip.y}} onStop={onStop}>
            <div className="chip" onDoubleClick={() => addChip(chip.name, chip.x + width*0.75, chip.y + height*0.75)} ref={ref}>
                {chip.name}
            </div>
        </Draggable>
    );
}
