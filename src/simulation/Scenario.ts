import { BeltItem } from "@/simulation/BeltItem";
import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { BeltEntity } from "@/simulation/buildings/Belt";
import { RotatorEntity } from "@/simulation/buildings/Rotator";
import { TrashEntity } from "@/simulation/buildings/Trash";

let item = new BeltItem();
let standardDef = new BeltLaneDefinition("normal", 0.5, 0.5);
let fastLaneDef = new BeltLaneDefinition("fast", 0.25, 0.5);

let belt1 = new BeltEntity(1n, 1n, 1n, 1n);
let belt2 = new BeltEntity(6n, 3n, 11n, 3n);
// ;

// let lane1 = new BeltLane("lane1", standardDef, 1n, 1n, 1n, 1n);
// let lane2 = new BeltLane("lane2", fastLaneDef, 6n, 2n, 11n, 3n);
// let lane3 = new BeltLane("lane3", standardDef, 31n, 2n, 41n, 3n);

var rotator = new RotatorEntity(11n, 1n, 21n, 1n);
let belt3 = new BeltEntity(26n, 3n, 41n, 3n);
let trash = new TrashEntity(31n, 2n, 51n, 5n);

belt1.MainLane.Item = item;
belt1.MainLane.Progress_T = 1n;

belt1.MainLane.NextLane = belt2.MainLane;
belt2.MainLane.NextLane = rotator.InputLane;

rotator.OutputLane.NextLane = belt3.MainLane;
belt3.MainLane.NextLane = trash.MainLane;

type Scenario = {
    buildings: MapEntity[];
};

export let SCENARIO: Scenario = {
    buildings: [belt1, belt2, rotator, belt3, trash],
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
