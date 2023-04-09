<template lang="pug">
.main
  .info
    | Tick: {{ tick }}
    br
    label
      input(type="checkbox", v-model="autoSpawnItems")
      | Auto Spawn Items
    br
    label
      input(type="checkbox", v-model="autoAdvanceSimulation")
      | Auto Advance Simulation [p]
    br
    label
      input(type="checkbox", v-model="showMaxStep")
      | Show MaxStep_S
    br
    button(@click="prevTick()", :disabled="snapshots.length == 0") Prev [j]
    button(@click="nextTick()") Next [k]
    button(@click="nextTick(2n)") Next 2
    button(@click="nextTick(3n)") Next 3
    button(@click="nextMaxTick()") Next (+{{maxTicksPerFrame}})
  h3 PROGRESS (WORLD SPACE STEPS)
  .simFrame
    .building(v-for="building in buildings" :style="buildingStyle(building)")
        .name {{ building.constructor.name }}
        .beltLane(
            v-for="lane in building.GetLanes()"
            :style="{ width: unit2px(lane.Definition.Length_S), left: unit2px(lane.PosX),  top: unit2px(lane.PosY) }"
        )
            .name
                | {{ lane.Name }}
                | (+{{ lane.Definition.StepsPerTick_S  }} / tick)
                | &RightArrow; {{ lane.NextLane == null ? "-" : lane.NextLane.Name }}
            .tick(
                v-for="i in Number(lane.Definition.Length_S)",
                :style="{ left: unit2px(i-1) }"
            )
                | {{ i-1 }}
            .maxStep(
                v-if="showMaxStep"
                :key="tick"
                :style="{ left: unit2px(lane.MaxStep_S)}"
            )
                | Max@{{ lane.Name }}@{{ lane.MaxStep_S }}

    template(v-for="{item, lane, id, style} in getAllWorldItems()" :key="id")
        .item.world(
            :class="['item-' + Number(id) % 20]"
            :style="style"
        )
            | Item{{ item.UID }}/{{ lane.Progress_T }}T/{{ lane.Definition.TicksToSteps_S(lane.Progress_T) }}S
            template(v-if="lane.AggregatedExtraProgress_T >= 0") +{{ lane.AggregatedExtraProgress_T }}

  br
  h3 PROGRESS (TICKS)
  .simFrame
    .building(v-for="building in buildings" :style="buildingStyle(building)")
        .beltLane(
            v-for="lane in building.GetLanes()"
            :style="{ width: unit2px(lane.Definition.Duration_T), left: unit2px(lane.PosX), top: unit2px(lane.PosY) }"
        )
            .name {{ lane.Name }}
            .tick(
                v-for="i in Number(lane.Definition.Duration_T)",
                :style="{ left: unit2px(i-1) }"
            )
                | {{ i-1 }}

    template(v-for="{item, lane, id, style} in getAllTickItems()" :key="id")
        .item.progress(
            :class="['item-' + Number(id) % 20]"
            :style="style"
        )
            | {{ lane.Item.UID }}
            .accumulatedProgress(
                v-if="lane.Item && lane.AggregatedExtraProgress_T > 0n"
                :style="{ width: unit2px(lane.AggregatedExtraProgress_T) }"
            ) +{{ lane.AggregatedExtraProgress_T }}


  h3 CONTENTS

  .contents
    .general
      p <b>BeltLaneDefinition.STEPS_PER_UNIT</b> {{ BeltLaneDefinition.STEPS_PER_UNIT }}
      p <b>BeltLaneDefinition.TICKS_PER_SECOND</b> {{ BeltLaneDefinition.TICKS_PER_SECOND }}
      p <b>BeltLaneDefinition.SPACING_S</b> {{ BeltLaneDefinition.SPACING_S }}
      p <b>BeltLaneDefinition.SPACING_HALF_S</b> {{ BeltLaneDefinition.SPACING_HALF_S }}
    .lane(v-for="lane in lanes")
      h3 {{lane.Name}}
      p <b>Item</b> {{ lane.Item?.UID }}
      p(v-if="lane.Item") <b>Progress_T</b> {{ lane.Progress_T }}
      p <b>MaxStep_S</b> {{ lane.MaxStep_S }}
      p <b>AggregatedExtraProgress_T</b> {{ lane.AggregatedExtraProgress_T }}
      p <b>Def</b> {{ lane.Definition.Name }}
      p <b>Def.Duration</b> {{ lane.Definition.Duration }}
      p <b>Def.Duration_T</b> {{ lane.Definition.Duration_W }}
      p <b>Def.Length_W</b> {{ lane.Definition.Length_W }}
      p <b>Def.Length_S</b> {{ lane.Definition.Length_S }}
      p <b>Def.StepsPerTick_S</b> {{ lane.Definition.StepsPerTick_S }}


</template>

<script setup lang="ts">
    import { BeltSimulation } from "@/simulation/BeltSimulation";
    import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
    import { SCENARIO } from "@/simulation/Scenario";
    import { reactive, ref } from "vue";
    import { BeltItem } from "@/simulation/BeltItem";
    import { MapEntity } from "@/simulation/MapEntity";
    import { toInt } from "@/simulation/polyfill";
    import type { int } from "@/simulation/polyfill";
    import { BeltLane } from "@/simulation/BeltLane";
    import type { SerializedBeltLane } from "@/simulation/BeltLane";
    import internal from "stream";

    let PIXEL_PER_STEP = 20;
    let tick = ref(0);

    let allLanes: BeltLane[] = [];
    for (var building of SCENARIO.buildings) {
        for (var lane of building.GetLanes()) {
            allLanes.push(lane);
        }
    }

    let lanes = reactive(allLanes.slice().reverse());
    let buildings = reactive(SCENARIO.buildings.slice().reverse());
    let autoSpawnItems = ref(true);
    let autoAdvanceSimulation = ref(false);
    let showMaxStep = ref(false);
    let maxTicksPerFrame = ref(BeltLaneDefinition.TICKS_PER_SECOND / 2n);

    type Snapshot = {
        hash: string;
        buildings: {
            data: any;
            lanes: SerializedBeltLane[];
        }[];
    };

    function hashCurrentSimulation() {
        var data = JSON.stringify(
            {
                buildings,
                tick: tick.value,
            },
            (_, v) => (typeof v === "bigint" ? v.toString() : v),
        );
        return data;
    }

    function makeSnapshot() {
        let result: Snapshot = {
            hash: hashCurrentSimulation(),
            buildings: [],
        };

        for (let building of buildings) {
            let data = building.Serialize();
            let lanes = [];
            for (let lane of building.GetLanes()) {
                lanes.push(lane.Extra_Serialize());
            }
            result.buildings.push({
                data,
                lanes,
            });
        }
        return result;
    }

    let snapshots: Snapshot[] = [];

    function nextTick(ticks: int = 1n) {
        snapshots.push(makeSnapshot());
        tick.value += Number(ticks);
        window.tick = tick.value;
        console.clear();
        console.log("TICK (", ticks, ")");
        for (var building of buildings) {
            building.OnUpdate(ticks);
        }
        if (autoSpawnItems.value) {
            var firstLane = lanes[lanes.length - 1];
            if (!firstLane.HasItem && firstLane.MaxStep_S >= 0) {
                firstLane.Item = new BeltItem();
                firstLane.Progress_T = firstLane.MaxTickClamped_T;
            }
        }
    }
    function prevTick() {
        if (snapshots.length == 0) {
            return;
        }
        console.clear();
        console.log("(previous tick loaded)");
        tick.value -= 1;
        window.tick = tick.value;

        var snapshot = snapshots.pop()!;
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            var data = snapshot.buildings[i];
            var lanes = building.GetLanes();
            building.Deserialize(data.data);
            for (var j = 0; j < lanes.length; j++) {
                lanes[j].Extra_Deserialize(data.lanes[j]);
            }
        }
        var newHash = hashCurrentSimulation();
        if (newHash != snapshot.hash) {
            console.error("SNAPSHOT MISMATCH:");
            console.warn("OLD:", snapshot.hash);
            console.warn("NEW:", newHash);
        }
    }

    function getAllWorldItems() {
        let result = [];
        for (var building of buildings) {
            for (var lane of building.GetLanes()) {
                if (!lane.HasItem) {
                    continue;
                }
                result.push({
                    id: lane.Item!.UID,
                    lane,
                    item: lane.Item,
                    style: {
                        left: unit2px(
                            lane.Definition.TicksToSteps_S(lane.Progress_T) + building.PosX + lane.PosX,
                        ),
                        top: unit2px(building.PosY + lane.PosY),
                    },
                });
            }
        }
        return result.sort((a, b) => Number(a.id - b.id));
    }

    function getAllTickItems() {
        let result = [];
        for (var building of buildings) {
            for (var lane of building.GetLanes()) {
                if (!lane.HasItem) {
                    continue;
                }
                result.push({
                    id: lane.Item!.UID,
                    lane,
                    item: lane.Item,
                    style: {
                        left: unit2px(lane.Progress_T + building.PosX + lane.PosX),
                        top: unit2px(building.PosY + lane.PosY),
                    },
                });
            }
        }
        return result.sort((a, b) => Number(a.id - b.id));
    }

    function nextMaxTick() {
        nextTick(maxTicksPerFrame.value);
    }

    function unit2px(unit: int) {
        return PIXEL_PER_STEP * Number(unit) + "px";
    }

    function buildingStyle(building: MapEntity) {
        return {
            width: unit2px(building.EffectiveDimensions.x),
            height: unit2px(building.EffectiveDimensions.y),
            left: unit2px(building.PosX),
            top: unit2px(building.PosY),
        };
    }

    function automaticTick() {
        if (!autoAdvanceSimulation.value) {
            return;
        }
        nextTick();
    }

    setInterval(automaticTick, 250);

    window.addEventListener("keydown", (ev) => {
        if (ev.key == "k") {
            nextTick();
        } else if (ev.key == "j") {
            prevTick();
        } else if (ev.key == "p") {
            autoAdvanceSimulation.value = !autoAdvanceSimulation.value;
        }
    });
</script>

<style lang="scss" scoped></style>
