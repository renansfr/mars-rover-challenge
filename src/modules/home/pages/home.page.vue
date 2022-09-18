<template>
  <mp-app-page title="Mars Rover Challenge">
    <div id="header" class="bg-white w-full shadow flex justify-center items-center p-2">
      <div class="flex flex-row w-full justify-center align-center items-center" v-if="!validatedUpperRightCoordinates">
        <mp-field label="Upper-right coordinates" class="mb-1" :errors="vp$.upperRightCoordinates.$errors">
          <mp-text-field
            v-model="plateauForm.upperRightCoordinates"
            placeholder="e.g. 5 5"
            class="w-full h-full"
          />
          <mp-button
            type="primary"
            variant="default"
            class="ml-2 align-center items-center w-40 h-full"
            id="login-submit"
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
            class="ml-2 mt-5 align-center items-center h-full justify-center"
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
                    id="roverPosition"/>
                </mp-field>
                <mp-field label="Instructions" class="mb-1 ml-4">
                  <mp-text-field
                    v-model="item.instructions"
                    placeholder="e.g. LMLMLMLMM"
                    :disabled="isAvailableCoordinates(index) && !isValidCoordinates(item)"
                    id="roverPosition"
                  />
                </mp-field>
              </div>
            </div>
          </div>
          <mp-button
            type="primary"
            variant="default"
            class="ml-4 mt-5 align-center items-center h-full justify-center"
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

    const alertUnavailableCoordinates = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The coordinates entered are already occupied by another rover. The last added rover with the same coordinates will be removed.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const alertCannotMove = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The coordinates you are trying to go are already occupied by another rover. Try another instruction.',
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

    const alertOutsidePlateauInitialPosition = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The coordinates you are trying to add the rover are outside the plateau. Try another initial position.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const alertUnavailableInitialPosition = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'The initial coordinates you are trying to add or modify the rover are already the initial position of another rover. Try another initial position.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    const alertInvalidInstructions = async () => {
      await dialog.confirm({
        title: 'Warning',
        message: 'You must enter valid instructions.',
        okButtonText: 'Ok',
        okButtonType: 'primary'
      })
    }

    // const alertIncompleteRoverForm = async () => {
    //   await dialog.confirm({
    //     title: 'Warning',
    //     message: 'You must enter valid initial position in all current fields to add more rovers.',
    //     okButtonText: 'Ok',
    //     okButtonType: 'primary'
    //   })
    // }

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

    const isValidCoordinates = (rover) => {
      const validInput = /^[0-9]+ [0-9]+ [N|S|E|W]$/.test(rover.roverPosition)
      const roverPositionArray = rover.roverPosition.split(' ')
      const x = parseInt(roverPositionArray[0])
      const y = parseInt(roverPositionArray[1])
      const validDirection = Object.values(Direction).includes(roverPositionArray[2] as Direction)
      const upperRightCoordinatesArray = plateauForm.upperRightCoordinates.split(' ')
      const upperRightX = parseInt(upperRightCoordinatesArray[0])
      const upperRightY = parseInt(upperRightCoordinatesArray[1])
      if (validInput && x <= upperRightX && y <= upperRightY && validDirection) {
        return true
      }
      rover.instructions = ''
      return false
    }

    const isAvailableCoordinates = (roverIndex: number) => {
      const roverPositionArray = computedRoverForm.value[roverIndex].roverPosition.split(' ')
      const x = parseInt(roverPositionArray[0])
      const y = parseInt(roverPositionArray[1])
      const upperRightCoordinatesArray = plateauForm.upperRightCoordinates.split(' ')
      const upperRightX = parseInt(upperRightCoordinatesArray[0])
      const upperRightY = parseInt(upperRightCoordinatesArray[1])
      if (x > (upperRightX - 1) ||
        y > (upperRightY - 1) ||
        x < 0 ||
        y < 0) {
        alertOutsidePlateauInitialPosition()
        computedRoverForm.value[roverIndex].roverPosition = ''
        computedRoverForm.value[roverIndex].instructions = ''
        return false
      }
      // const unavailableInitialPosition = computedRoverForm.value.find((rover, index) => {
      //   if (index !== roverIndex) {
      //     const computedRoverPositionArray = rover.roverPosition.split(' ')
      //     const computedX = parseInt(computedRoverPositionArray[0])
      //     const computedY = parseInt(computedRoverPositionArray[1])
      //     if (x === computedX && y === computedY) {
      //       alertUnavailableInitialPosition()
      //       computedRoverForm.value[index].roverPosition = ''
      //       computedRoverForm.value[index].instructions = ''
      //       return false
      //     }
      //   }
      // })
      computedRoverForm.value.forEach((rover, index: number) => {
        if (index !== roverIndex) {
          const computedRoverPositionArray = rover.roverPosition.split(' ')
          const computedX = parseInt(computedRoverPositionArray[0])
          const computedY = parseInt(computedRoverPositionArray[1])
          if (x === computedX && y === computedY) {
            alertUnavailableInitialPosition()
            computedRoverForm.value[index].roverPosition = ''
            computedRoverForm.value[index].instructions = ''
            return false
          }
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
      // const hasIncompleteRoverForm = computedRoverForm.value.find((rover) => !isValidCoordinates(rover))
      // if (hasIncompleteRoverForm) {
      //   alertIncompleteRoverForm()
      //   return
      // }
      roverForm.value.push({
        roverPosition: '',
        instructions: ''
      })
    }

    // const removeRoverForm = (index: number) => {
    //   roverForm.value.splice(index, 1)
    // }

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

    const resolveSequentially = async (array, fn) => {
      await array.reduce(
        (acc, item) => acc.then(async () => fn(item)),
        Promise.resolve()
      )
    }

    const executeInstructions = (roverForm, roverIndex) => {
      const roverPosition = roverForm.roverPosition
      const roverPositionArray = roverPosition.split(' ')
      let roverPositionX = parseInt(roverPositionArray[0])
      let roverPositionY = parseInt(roverPositionArray[1])
      let roverDirection = roverPositionArray[2]
      const northMovementIsAvailableCoordinates = (roverPositionY) => {
        const futureYCoordinate = roverPositionY + 1
        if (isUnavailableCoordinate(roverPositionX, futureYCoordinate)) {
          return false
        }
        return true
      }

      const northMovementIsInsidePlateau = (roverPositionY) => {
        const futureYCoordinate = roverPositionY + 1
        if (!(futureYCoordinate < (parseInt(plateauForm.upperRightCoordinates.split(' ')[1])))) {
          return false
        }
        return true
      }

      const southMovementIsAvailableCoordinates = (roverPositionY) => {
        const futureYCoordinate = roverPositionY - 1
        if (isUnavailableCoordinate(roverPositionX, futureYCoordinate)) {
          return false
        }
        return true
      }

      const southMovementIsInsidePlateau = (roverPositionY) => {
        const futureYCoordinate = roverPositionY - 1
        if (!(futureYCoordinate >= 0)) {
          return false
        }
        return true
      }

      const eastMovementIsAvailableCoordinates = (roverPositionX) => {
        const futureXCoordinate = roverPositionX + 1
        if (isUnavailableCoordinate(futureXCoordinate, roverPositionY)) {
          return false
        }
        return true
      }

      const eastMovementIsInsidePlateau = (roverPositionX) => {
        const futureXCoordinate = roverPositionX + 1
        if (!(futureXCoordinate < (parseInt(plateauForm.upperRightCoordinates.split(' ')[0])))) {
          return false
        }
        return true
      }

      const westMovementIsAvailableCoordinates = (roverPositionX) => {
        const futureXCoordinate = roverPositionX - 1
        if (isUnavailableCoordinate(futureXCoordinate, roverPositionY)) {
          return false
        }
        return true
      }

      const westMovementIsInsidePlateau = (roverPositionX) => {
        const futureXCoordinate = roverPositionX - 1
        if (!(futureXCoordinate >= 0)) {
          return false
        }
        return true
      }

      const isUnavailableCoordinate = (roverPositionX, roverPositionY) => {
        const otherRovers = rovers.value.filter((rover, index) => index !== roverIndex)
        const isUnavailable = otherRovers.some((rover, index) => rover.position.x === roverPositionX && rover.position.y === roverPositionY && index !== roverIndex)
        return isUnavailable
      }

      if (roverForm.instructions) {
        const instructionsArray = roverForm.instructions.split('')
        instructionsArray.forEach((instruction, index) => {
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
            case Move.RIGHT :
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
                  if (!northMovementIsAvailableCoordinates(roverPositionY)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertCannotMove()
                  }
                  if (!northMovementIsInsidePlateau(roverPositionY)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertOutsidePlateau()
                  }
                  return roverPositionY++
                case Direction.SOUTH:
                  if (!southMovementIsAvailableCoordinates(roverPositionY)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertCannotMove()
                  }
                  if (!southMovementIsInsidePlateau(roverPositionY)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertOutsidePlateau()
                  }
                  return roverPositionY--
                case Direction.EAST:
                  if (!eastMovementIsAvailableCoordinates(roverPositionX)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertCannotMove()
                  }
                  if (!eastMovementIsInsidePlateau(roverPositionX)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertOutsidePlateau()
                  }
                  return roverPositionX++
                case Direction.WEST:
                  if (!westMovementIsAvailableCoordinates(roverPositionX)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertCannotMove()
                  }
                  if (!westMovementIsInsidePlateau(roverPositionX)) {
                    roverForm.instructions = roverForm.instructions.slice(0, -1)
                    return alertOutsidePlateau()
                  }
                  return roverPositionX--
              }
              break
            default:
              roverForm.instructions = roverForm.instructions.slice(0, -1)
              return alertInvalidInstructions()
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
      async (newValue) => {
        const updatedRovers = await Promise.all(newValue.map(async (roverForm, roverIndex) => {
          await nextTick()
          return executeInstructions(roverForm, roverIndex)
        }))
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
