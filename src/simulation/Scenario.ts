import { BeltItem } from "@/simulation/BeltItem";
import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { RotatorEntity } from "@/simulation/buildings/Rotator";
import { TrashEntity } from "@/simulation/buildings/Trash";

let item = new BeltItem();
let standardDef = new BeltLaneDefinition("normal", 0.5, 0.5);
let fastLaneDef = new BeltLaneDefinition("fast", 0.25, 0.5);

let lane1 = new BeltLane("lane1", standardDef, 1n, 1n, 1n, 1n);
let lane2 = new BeltLane("lane2", fastLaneDef, 6n, 2n, 11n, 3n);
let lane3 = new BeltLane("lane3", standardDef, 31n, 2n, 41n, 3n);

var rotator = new RotatorEntity(11n, 1n, 21n, 1n);
let trash = new TrashEntity(41n, 2n, 51n, 5n);

lane1.Item = item;
lane1.Progress_T = 1n;

lane1.NextLane = lane2;
lane2.NextLane = rotator.InputLane;

rotator.OutputLane.NextLane = lane3;
lane3.NextLane = trash.MainLane;

type Scenario = {
    lanes: BeltLane[];
    buildings: MapEntity[];
};

export let SCENARIO: Scenario = {
    lanes: [
        lane1,
        lane2,
        rotator.InputLane,
        rotator.ProcessingLane,
        rotator.OutputLane,
        lane3,
        trash.MainLane,
    ],
    buildings: [],
};

for (var lane of SCENARIO.lanes) {
    if (lane.HasItem) {
        BeltSimulation.UpdateLaneMaxProgressWithItem(lane);
    } else {
        lane.MaxStep_S = lane.ComputeMaxStepWhenEmpty_S();
    }
}
