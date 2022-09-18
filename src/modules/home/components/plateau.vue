<template>
  <div class="flex flex-row" v-if="upperRightX && upperRightY">
    <div v-for="(x, index) in upperRightX" :key="index">
      <div v-for="(y, index) in upperRightY" :key="index" class="bg-red-300 border border-black h-28 w-28 m-1">
        <div v-if="computedRovers">
          ({{ x - 1 }}, {{ upperRightY - y  }})
          <div v-for="(rover, index) in computedRovers" :key="index">
            <div v-if="rover.position.x === x - 1 && rover.position.y === upperRightY - y && rover.position.direction" >
              <div v-if="rover.position.direction === Direction.NORTH" class="items-center justify-center align-center">
                <img src="../../../assets/images/north-side-rover.png" alt="north" >
              </div>
              <div v-if="rover.position.direction === Direction.SOUTH">
                <img src="../../../assets/images/south-side-rover.png" alt="south" class="">
              </div>
              <div v-if="rover.position.direction === Direction.WEST">
                <img src="../../../assets/images/west-side-rover.png" alt="west" class="">
              </div>
              <div v-if="rover.position.direction === Direction.EAST">
                <img src="../../../assets/images/east-side-rover.png" alt="east" class="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="font-title text-4xl font-semibold text-center mt-8 mb-8">
      Welcome to Mars!
    </div>
    <div class="text-xl text-center">
      To take a rover ride, follow the instructions below: <br>
      1. Enter the upper-right coordinates of the plateau (e.g. 5 5) <br>
      2. Enter a valid starting position of the rover to later insert instructions (e.g. 1 2 N) <br>
      3. Enter the instructions for the rover (e.g. LMLMLMLMM) <br>
      4. Repeat steps 2 and 3 for as many rovers as you want to add<br>
      5. Take care inserting valid inputs (whitespaces and case sensitive letters)<br>
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
      return Number(props.upperRightCoordinates.split(' ')[0])
    })

    const upperRightY = computed(() => {
      return Number(props.upperRightCoordinates.split(' ')[1])
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

    // const roverPositions = computed(() => {
    //   return props.rovers.map((rover) => {
    //     return rover.position
    //   })
    // })

    // const roverInstructions = computed(() => {
    //   return props.rovers.map((rover) => {
    //     return rover.instructions
    //   })
    // })
    watch(
      () => props.rovers,
      (newValue) => {
        roversInternalValue.value = newValue
        console.log('computedRovers.value', computedRovers.value)
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
