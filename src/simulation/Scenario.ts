import { BeltItem } from "@/simulation/BeltItem";
import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";

let item = new BeltItem();
let standardDef = new BeltLaneDefinition("normal", 0.5, 0.5);
let fastLaneDef = new BeltLaneDefinition("fast", 0.4, 0.4);

let lane1 = new BeltLane("lane1", standardDef, 1n, 1n, 1n, 1n);

let lane2 = new BeltLane("lane2", fastLaneDef, 6n, 2n, 11n, 3n);
let lane3 = new BeltLane("lane3", standardDef, 11n, 1n, 21n, 1n);

lane1.Item = item;
lane1.Progress_T = 1n;

lane1.NextLane = lane2;
lane2.NextLane = lane3;

export let SCENARIO: BeltLane[] = [lane1, lane2, lane3].reverse();

for (var lane of SCENARIO) {
    if (lane.HasItem) {
        BeltSimulation.UpdateLaneMaxProgressWithItem(lane);
    } else {
        lane.MaxStep_S = lane.ComputeMaxStepWhenEmpty_S();
    }
}
