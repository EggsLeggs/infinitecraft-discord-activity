import * as React from 'react';
import './InfiniteCraftActivity.css';
import './Chip.css';
import { Chip } from './Chip';

export function VoiceChannelActivity() {
  const ref = React.useRef(null)

  const [activeChips, setActiveChips] = React.useState<{name: string, x: number, y: number}[]>([]);
  const [allChips, setAllChips] = React.useState<string[]>([]);
  const [height, setHeight] = React.useState(0)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    if (ref.current) {
        setHeight((ref.current as HTMLElement).clientHeight);
        setWidth((ref.current as HTMLElement).clientWidth);
    }
}, [ref.current])
  
  React.useEffect(() => {
    fetch('/api/chips')
      .then(res => res.json())
      .then(data => {
        // set random x and y around the center
        setActiveChips(data.map((name: string) => ({name, x: 0, y: 0})));
      });
    fetch('/api/chips')
      .then(res => res.json())
      .then(data => {
        setAllChips(data);
      });
  }
  , []);

  const setChipPosition = (index: number, x: number, y: number) => {
    const newChips = [...activeChips];
    newChips[index].x = x;
    newChips[index].y = y;
    setActiveChips(newChips);
  }

  const addChip = ( name: string, x: number, y: number) => {
    console.log('adding chip', name);
    setActiveChips([...activeChips, {name, x: 0, y: 0}]);
  }

  const mergeChip = (index1: number, index2: number) => {
    const newChips = activeChips.filter((chip, i) => i !== index1 && i !== index2);
    const x = activeChips[index2].x
    const y = activeChips[index2].y
    setActiveChips(newChips);
    fetch(`/api/pair?first=${activeChips[index1].name}&second=${activeChips[index2].name}`)
      .then(res => res.json())
      .then(data => {
        setActiveChips([...newChips, {name: data.response, x, y}]);
          // add to new chips
          // TODO: make this an api call
          setAllChips([...allChips, data.response]);
      });
  }

  return (
    <div className="game_container">
      <div className='playspace_container' ref={ref}>
      {activeChips.map((chip, index) => (
        <Chip setChipPosition={setChipPosition} key={index} chip={chip} addChip={addChip} activeChips={activeChips} mergeChip={mergeChip} index={index}/>
      ))}
      </div>
      <div className='chips_container'>
        {allChips.map((chip, index) => (
          <div className='chip' key={index} style={{position: 'relative', margin: 2}} onDoubleClick={() => addChip(chip, 0, 0)}>{chip}</div>
        ))}
      </div>
    </div>
  );
}
