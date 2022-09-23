<template>
  <div class="flex flex-row" v-if="upperRightX && upperRightY" id="plateau">
    <div v-for="(x, index) in upperRightX" :key="index">
      <div v-for="(y, index) in upperRightY" :key="index" class="bg-red-300 border border-black h-28 w-28 m-1">
        <div v-if="computedRovers">
          ({{ x - 1 }}, {{ upperRightY - y  }})
          <div v-for="(rover, index) in computedRovers" :key="index">
            <div v-if="rover.position.x === x - 1 && rover.position.y === upperRightY - y" id="rover">
              <div v-if="rover.position.direction === Direction.NORTH" class="items-center justify-center align-center">
                <img
                  src="../../../assets/images/north-side-rover.png"
                  alt="north"
                  :xPosition="String(rover.position.x)"
                  :yPosition="String(rover.position.y)"
                  :direction="rover.position.direction"
                  id="north-rover"
                >
              </div>
              <div v-if="rover.position.direction === Direction.SOUTH">
                <img
                  src="../../../assets/images/south-side-rover.png"
                  alt="south"
                  :xPosition="String(rover.position.x)"
                  :yPosition="String(rover.position.y)"
                  :direction="rover.position.direction"
                  id="south-rover"
                >
              </div>
              <div v-if="rover.position.direction === Direction.WEST">
                <img
                  src="../../../assets/images/west-side-rover.png"
                  alt="west"
                  :xPosition="String(rover.position.x)"
                  :yPosition="String(rover.position.y)"
                  :direction="rover.position.direction"
                  id="west-rover"
                >
              </div>
              <div v-if="rover.position.direction === Direction.EAST">
                <img
                  src="../../../assets/images/east-side-rover.png"
                  alt="east"
                  :xPosition="String(rover.position.x)"
                  :yPosition="String(rover.position.y)"
                  :direction="rover.position.direction"
                  id="east-rover"
                >
              </div>
              <div v-if="!rover.position.direction" id="rover-without-direction">
                <img
                  :xPosition="String(rover.position.x)"
                  :yPosition="String(rover.position.y)"
                  :direction="'none'"
                  src="../../../assets/images/north-side-rover.png"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="font-title text-4xl text-red-600 font-semibold text-center mt-8 mb-8">
      Welcome to Mars!
    </div>
    <div class="text-xl text-left">
      To take a rover ride, follow the instructions below: <br><br>
      1. Enter the upper-right coordinates of the plateau (e.g. 5 5) <br><br>
      2. Enter a valid starting position of the rover to later insert instructions,
      where the first number is the position on x axis, the second is the position on y axis
      and the last letter is the direction ("N" for North, "S" for South, "E" for East and "W" for West) (e.g. 1 2 N) <br><br>
      3. Enter the instructions for the rover where "L" is turn left, "R" is turn right and "M" is move forward (e.g. LMLMLMLMM) <br><br>
      4. Click "Add Rover" and repeat steps 2 and 3 for as many rovers as you want to add<br><br>
      5. Take care inserting valid inputs (whitespaces and case sensitive letters)<br><br>
      6. Have fun!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

import { computed } from '@vue/reactivity'
import { Direction } from '../../app/enums'

export default defineComponent({
  name: 'plateau',
  props: {
    upperRightCoordinates: {
      type: String,
      required: true
    },
    rovers: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const upperRightX = computed(() => {
      return Number(props.upperRightCoordinates.split(' ')[0]) + 1
    })

    const upperRightY = computed(() => {
      return Number(props.upperRightCoordinates.split(' ')[1]) + 1
    })

    const roversInternalValue = ref<any>(props.rovers)

    const computedRovers = computed<any>({
      get() {
        return roversInternalValue.value
      },
      set(newValue) {
        roversInternalValue.value = newValue
      }
    })

    watch(
      () => props.rovers,
      (newValue) => {
        roversInternalValue.value = newValue
      }
    )

    return {
      upperRightX,
      upperRightY,
      computedRovers,
      Direction
    }
  }
})
</script>
