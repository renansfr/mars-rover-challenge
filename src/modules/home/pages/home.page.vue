<template>
  <mp-app-page title="Mars Rover Challenge">
    <div id="header" class="bg-white w-full shadow flex justify-center items-center p-2">
      <div class="flex flex-row w-full justify-center align-center items-center" v-if="!validatedUpperRightCoordinates">
        <mp-field label="Upper-right coordinates" class="mb-1" :errors="vp$.upperRightCoordinates.$errors">
          <mp-text-field
            v-model="plateauForm.upperRightCoordinates"
            placeholder="e.g. 5 5"
            class="w-full h-full"
            id="upper-right-coordinates"
          />
          <mp-button
            type="primary"
            variant="default"
            class="ml-2 align-center items-center w-40 h-9"
            id="upper-right-submit"
            @click="permitToAddRovers()"
          >
            Add rovers
          </mp-button>
        </mp-field>
      </div>
        <div class="flex flex-row w-full justify-center align-center items-center" v-else>
          <mp-button
            type="primary"
            variant="default"
            class="ml-2 mt-5 align-center items-center h-9 justify-center"
            id="go-back"
            @click="goBack()"
          >
            Go back
          </mp-button>
          <div v-for="item in 1" :key="item">
            <div class="flex flex-col" v-for="item, index in computedRoverForm" :key="index">
              <div class="flex flex-row w-full justify-center align-center items-center">
                <mp-field label="Rover initial position" class="mb-1 ml-4">
                  <mp-text-field
                    v-model="item.roverPosition"
                    placeholder="e.g. 1 2 N"
                    v-autofocus
                    id="rover-initial-position"/>
                </mp-field>
                <mp-field label="Instructions" class="mb-1 ml-4">
                  <mp-text-field
                    v-model="item.instructions"
                    placeholder="e.g. LMLMLMLMM"
                    :disabled="isAvailableCoordinates(index) && !isValidCoordinates(index)"
                    id="instructions"
                    v-mask="{ mask: 'H*', tokens: { 'H': { pattern: /^[LMR]+$/, uppercase: true }}}"
                  />
                </mp-field>
              </div>
            </div>
          </div>
          <mp-button
            type="primary"
            variant="default"
            class="ml-4 mt-5 align-center items-center h-9 justify-center"
            id="add-rover"
            @click="addRoverForm(item)"
          >
            Add rover
          </mp-button>
      </div>
    </div>
    <div class="content-center">
      <div class="flex flex-col p-8 w-100 overflow-auto">
        <Plateau
          :upperRightCoordinates="plateauForm.upperRightCoordinates"
          :rovers="rovers"
        />
      </div>
    </div>
  </mp-app-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch, nextTick } from 'vue'
import Plateau from '../components/plateau.vue'
import { Direction, Move } from '../../app/enums'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useDialog } from '@/modules/app/compositions'
import { Rover } from '@/modules/app/models'

export default defineComponent({
  name: 'home.index',
  components: {
    Plateau
  },
  setup() {
    const dialog = useDialog()
    const rovers = ref<Rover[]>([])
    const plateauForm = reactive(
      {
        upperRightCoordinates: ''
      }
    )
    const roverForm = ref(
      [
        {
          roverPosition: '',
          instructions: ''
        }
      ]
    )
    const plateauRules = {
      upperRightCoordinates: {
        required: helpers.withMessage('Required field.', required),
        validCoordinates: helpers.withMessage('Invalid field', helpers.regex(/^[0-9]+ [0-9]+$/))
      }
    }

    const vp$ = useVuelidate(plateauRules, plateauForm)

    const validatedUpperRightCoordinates = ref<boolean>(false)

    const alertInvalidUpperRighCoordinates = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'You must enter valid upper-right coordinates to add rovers.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const alertOutsidePlateau = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The coordinates you are trying to move forward are outside the plateau. Try another instruction.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const alertOutsidePlateauFirstPosition = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The coordinates you are trying to add the rover are outside the plateau. Try another initial position.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const computedRoverForm = computed<any>({
      get() {
        return roverForm.value
      },
      set(newValue) {
        roverForm.value = newValue
      }
    })

    const validateUpperRightCoordinates = () => {
      vp$.value.$touch()
      return !vp$.value.$invalid
    }

    const isValidCoordinates = (index: number) => {
      const validInput = /^[0-9]+ [0-9]+ [N|S|E|W]$/.test(computedRoverForm.value[index].roverPosition)
      const roverPositionArray = computedRoverForm.value[index].roverPosition.split(' ')
      const x = parseInt(roverPositionArray[0])
      const y = parseInt(roverPositionArray[1])
      const validDirection = Object.values(Direction).includes(roverPositionArray[2] as Direction)
      const upperRightCoordinatesArray = plateauForm.upperRightCoordinates.split(' ')
      const upperRightX = parseInt(upperRightCoordinatesArray[0])
      const upperRightY = parseInt(upperRightCoordinatesArray[1])
      if (validInput && x <= upperRightX && y <= upperRightY && validDirection) {
        return true
      }
      computedRoverForm.value[index].instructions = ''
      return false
    }

    const isAvailableCoordinates = () => {
      const upperRightCoordinatesArray = plateauForm.upperRightCoordinates.split(' ')
      const upperRightX = parseInt(upperRightCoordinatesArray[0])
      const upperRightY = parseInt(upperRightCoordinatesArray[1])
      rovers.value.forEach((rover, roverIndex) => {
        if (rover.position.x > (upperRightX - 1) ||
          rover.position.y > (upperRightY - 1) ||
          rover.position.x < 0 ||
          rover.position.y < 0) {
          alertOutsidePlateauFirstPosition()
          computedRoverForm.value[roverIndex].roverPosition = ''
          computedRoverForm.value[roverIndex].instructions = ''
          return false
        }
      })
      return true
    }

    const permitToAddRovers = () => {
      const plateauFormIsValid = validateUpperRightCoordinates()
      if (!plateauFormIsValid) {
        alertInvalidUpperRighCoordinates()
        return
      }
      validatedUpperRightCoordinates.value = true
    }

    const addRoverForm = () => {
      roverForm.value.push({
        roverPosition: '',
        instructions: ''
      })
    }

    const goBack = async () => {
      const shouldClose = await dialog.confirm({
        title: 'You really want to go back?',
        message: 'If you go back, all the rover data entered will be lost.',
        okButtonText: 'Yes',
        okButtonType: 'danger',
        cancelButton: true,
        cancelButtonText: 'No',
        cancelButtonVariant: 'outline'
      })
      if (shouldClose) {
        roverForm.value = [
          {
            roverPosition: '',
            instructions: ''
          }
        ]
        validatedUpperRightCoordinates.value = false
      }
    }

    const executeInstructions = (roverForm) => {
      const roverPosition = roverForm.roverPosition
      const roverPositionArray = roverPosition.split(' ')
      let roverPositionX = parseInt(roverPositionArray[0])
      let roverPositionY = parseInt(roverPositionArray[1])
      let roverDirection = roverPositionArray[2]
      if (roverForm.instructions) {
        roverForm.instructions.split('').forEach((instruction) => {
          switch (instruction) {
            case Move.LEFT:
              switch (roverDirection) {
                case Direction.NORTH:
                  roverDirection = Direction.WEST
                  break
                case Direction.SOUTH:
                  roverDirection = Direction.EAST
                  break
                case Direction.EAST:
                  roverDirection = Direction.NORTH
                  break
                case Direction.WEST:
                  roverDirection = Direction.SOUTH
                  break
              }
              break
            case Move.RIGHT:
              switch (roverDirection) {
                case Direction.NORTH:
                  roverDirection = Direction.EAST
                  break
                case Direction.SOUTH:
                  roverDirection = Direction.WEST
                  break
                case Direction.EAST:
                  roverDirection = Direction.SOUTH
                  break
                case Direction.WEST:
                  roverDirection = Direction.NORTH
                  break
              }
              break
            case Move.FORWARD:
              switch (roverDirection) {
                case Direction.NORTH:
                  if (roverPositionY < (parseInt(plateauForm.upperRightCoordinates.split(' ')[1]) - 1)) {
                    return roverPositionY++
                  }
                  nextTick(() => {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                  })
                  return alertOutsidePlateau()
                case Direction.SOUTH:
                  if (roverPositionY > 0) {
                    return roverPositionY--
                  }
                  nextTick(() => {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                  })
                  return alertOutsidePlateau()
                case Direction.EAST:
                  if (roverPositionX < (parseInt(plateauForm.upperRightCoordinates.split(' ')[0]) - 1)) {
                    return roverPositionX++
                  }
                  nextTick(() => {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                  })
                  return alertOutsidePlateau()
                case Direction.WEST:
                  if (roverPositionX > 0) {
                    return roverPositionX--
                  }
                  nextTick(() => {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                  })
                  return alertOutsidePlateau()
              }
              break
            default:
              break
          }
        })
      }
      const instructions = roverForm.instructions
      const rover = {
        position: {
          x: roverPositionX,
          y: roverPositionY,
          direction: roverDirection
        },
        instructions: instructions
      }
      return rover
    }

    watch(
      () => roverForm.value,
      (newValue) => {
        const updatedRovers = newValue.map((roverForm) => {
          return executeInstructions(roverForm)
        })
        rovers.value = updatedRovers
      },
      { deep: true }
    )

    return {
      plateauForm,
      roverForm,
      validatedUpperRightCoordinates,
      validateUpperRightCoordinates,
      vp$,
      permitToAddRovers,
      goBack,
      addRoverForm,
      rovers,
      computedRoverForm,
      isValidCoordinates,
      isAvailableCoordinates
    }
  }
})
</script>
