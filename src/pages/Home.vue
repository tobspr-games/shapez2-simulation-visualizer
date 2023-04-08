<template lang="pug">
.main
  .info
    | Tick: {{ tick }}
    br
    button(@click="prevTick()", :disabled="snapshots.length == 0") Prev [j]
    button(@click="nextTick()") Next [k]
  h3 PROGRESS (WORLD SPACE STEPS)
  .simFrame
    .beltLane(v-for="lane in lanes" :style="{ width: (PIXEL_PER_STEP * Number(lane.Definition.Length_S) - 2) + 'px', left: (10 + PIXEL_PER_STEP * Number(lane.PosXw) + 'px'),  top: (10 + PIXEL_PER_STEP * Number(lane.PosYw) + 'px') }")
      .name {{ lane.Name }} (+{{ lane.Definition.StepsPerTick_S  }} / tick)
      .tick(v-for="i in Number(lane.Definition.Length_S)", :style="{ left: ((i-1) * PIXEL_PER_STEP) + 'px'}") {{ i-1 }}_S
      .maxStep(:style="{ left: ((Number(lane.MaxStep_S)) * PIXEL_PER_STEP) + 'px'}") Max@{{ lane.Name }}@{{ lane.MaxStep_S }}
      .item.world(v-if="lane.Item" :style="{ left: (Number(lane.Definition.TicksToSteps_S(lane.Progress_T)) * PIXEL_PER_STEP) + 'px'}") \#{{ lane.Item.UID }}@{{ lane.Progress_T }}@{{ lane.Definition.TicksToSteps_S(lane.Progress_T) }}
  br
  h3 PROGRESS (TICKS)
  .simFrame
    .beltLane(v-for="lane in lanes" :style="{ width: (PIXEL_PER_STEP * Number(lane.Definition.Duration_T) - 2) + 'px', left: (10 + PIXEL_PER_STEP * Number(lane.PosX) + 'px'),  top: (10 + PIXEL_PER_STEP * Number(lane.PosY) + 'px') }")
      .name {{ lane.Name }}
      .tick(v-for="i in Number(lane.Definition.Duration_T)", :style="{ left: ((i-1) * PIXEL_PER_STEP) + 'px'}") {{ i-1 }}_T
      .item.progress(v-if="lane.Item" :style="{ left: (Number(lane.Progress_T) * PIXEL_PER_STEP) + 'px'}") \#{{ lane.Item.UID }}@{{ lane.Progress_T }}

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
    import type { int } from "@/simulation/polyfill";

    let PIXEL_PER_STEP = 40;
    let tick = ref(0);
    let lanes = reactive(SCENARIO);

    type Snapshot = { item?: BeltItem; progress_T: int; maxStep_S: int }[];
    function makeSnapshot() {
        var result: Snapshot = [];

        for (var lane of lanes) {
            result.push({
                item: lane.Item,
                progress_T: lane.Progress_T,
                maxStep_S: lane.MaxStep_S,
            });
        }
        return result;
    }

    let snapshots: Snapshot[] = [];

    function nextTick() {
        snapshots.push(makeSnapshot());
        ++tick.value;
        for (var lane of lanes) {
            BeltSimulation.UpdateLane(lane, 1n);
            console.log(lane.Item, lane.Progress_T);
        }
    }
    function prevTick() {
        if (snapshots.length == 0) {
            return;
        }
        var snapshot = snapshots.pop()!;
        for (var i = 0; i < lanes.length; ++i) {
            var lane = lanes[i];
            var data = snapshot[i];
            lane.Item = data.item;
            lane.Progress_T = data.progress_T;
            lane.MaxStep_S = data.maxStep_S;
        }
    }

    window.addEventListener("keydown", (ev) => {
        console.log(ev.key);
        if (ev.key == "k") {
            nextTick();
        } else if (ev.key == "j") {
            prevTick();
        }
    });
</script>

<style lang="scss" scoped></style>
