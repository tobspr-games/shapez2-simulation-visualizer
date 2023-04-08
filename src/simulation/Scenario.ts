import { BeltItem } from "@/simulation/BeltItem";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { BeltEntity, SlowBeltEntity } from "@/simulation/buildings/Belt";
import { MergerEntity } from "@/simulation/buildings/Merger";
import { RotatorEntity } from "@/simulation/buildings/Rotator";
import { SplitterEntity } from "@/simulation/buildings/Splitter";
import { TrashEntity } from "@/simulation/buildings/Trash";

let item = new BeltItem();

let belt1 = new BeltEntity(1n, 1n, 1n, 1n);
let splitter = new SplitterEntity(6n, 3n, 11n, 3n);

let beltUp = new BeltEntity(20n, 1n, 31n, 1n);
let beltDown = new BeltEntity(20n, 7n, 31n, 7n);

let merger = new MergerEntity(30n, 1n, 41n, 1n);

// var rotator = new RotatorEntity(21n, 1n, 31n, 1n);
// let belt3 = new BeltEntity(36n, 3n, 51n, 3n);
let lastBelt = new SlowBeltEntity(51n, 1n, 61n, 1n);
let trash = new TrashEntity(61n, 1n, 71n, 1n);
// let trashLower = new TrashEntity(16n, 7n, 31n, 7n);

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
