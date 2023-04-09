import { BeltItem } from "@/simulation/BeltItem";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { BeltEntity, SlowBeltEntity } from "@/simulation/buildings/Belt";
import { MergerEntity } from "@/simulation/buildings/Merger";
import { RotatorEntity } from "@/simulation/buildings/Rotator";
import { SplitterEntity } from "@/simulation/buildings/Splitter";
import { TrashEntity } from "@/simulation/buildings/Trash";

let item = new BeltItem();

let belt1 = new BeltEntity(1n, 0n);
let splitter = new SplitterEntity(belt1.RightEndX, 0n);

let beltUp = new BeltEntity(splitter.RightEndX, 0n);
let beltDown = new BeltEntity(splitter.RightEndX, 7n);

let merger = new MergerEntity(beltUp.RightEndX, 0n);

let lastBelt = new SlowBeltEntity(merger.RightEndX, 0n);
let trash = new TrashEntity(lastBelt.RightEndX, 0n);

belt1.MainLane.Item = item;
belt1.MainLane.Progress_T = 1n;

belt1.MainLane.NextLane = splitter.InputLane;

splitter.OutputLanes[0].NextLane = beltUp.MainLane;
splitter.OutputLanes[1].NextLane = beltDown.MainLane;

beltUp.MainLane.NextLane = merger.InputLanes[0];
beltDown.MainLane.NextLane = merger.InputLanes[1];

merger.OutputLane.NextLane = lastBelt.MainLane;
lastBelt.MainLane.NextLane = trash.MainLane;

// splitter.OutputLanes[0].NextLane = rotator.InputLane;
// splitter.OutputLanes[1].NextLane = trashLower.MainLane;

// rotator.OutputLane.NextLane = belt3.MainLane;
// belt3.MainLane.NextLane = trash.MainLane;

type Scenario = {
    buildings: MapEntity[];
};

export let SCENARIO: Scenario = {
    buildings: [belt1, splitter, beltUp, beltDown, merger, lastBelt, trash],
};

for (var building of SCENARIO.buildings) {
    for (var lane of building.GetLanes()) {
        if (lane.HasItem) {
            BeltSimulation.UpdateLaneMaxProgressWithItem(lane);
        } else {
            lane.MaxStep_S = lane.ComputeMaxStepWhenEmpty_S();
        }
    }
}
