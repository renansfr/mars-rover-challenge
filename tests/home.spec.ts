import { test, expect, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/')
})

const UPPER_RIGHT_COORDINATES = '5 5'

const ROVER_INITIAL_POSITIONS = '1 2 N'

test.describe('New Plateau', () => {
  test('should create a new plateau', async ({ page }) => {
    await page.locator('#upper-right-coordinates').fill(UPPER_RIGHT_COORDINATES)
    await page.locator('#upper-right-submit').click()

    await expect(page.locator('#plateau')).toBeVisible()
  })

  test('Should show error messages on field when invalid upper right coordinates are passed', async ({ page }) => {
    await page.locator('#upper-right-coordinates').fill('1 2')
    await page.locator('#upper-right-submit').click()

    await page.locator('text="You must enter valid upper-right coordinates to add rovers."').isVisible()
  })
})

test.describe('Add New Rovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#upper-right-coordinates').fill(UPPER_RIGHT_COORDINATES)
    await page.locator('#upper-right-submit').click()
  })
  test('should add a new rover', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)

    await expect(page.locator('#rover')).toBeVisible()
  })
  test('should not permit pass instructions when uncomplete initial position is passed', async ({ page }) => {
    await page.locator('#rover-initial-position').fill('1 2')

    await expect(page.locator('#instructions')).toBeDisabled()
  })
  test('should not permit pass instructions when invalid initial position is passed', async ({ page }) => {
    await page.locator('#rover-initial-position').fill('1 2 P')

    await expect(page.locator('#instructions')).toBeDisabled()
  })
})

test.describe('Rover Instructions', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#upper-right-coordinates').fill(UPPER_RIGHT_COORDINATES)
    await page.locator('#upper-right-submit').click()
  })
  test('should move rover forward to the correct position', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)
    await page.locator('#instructions').fill('M')

    await expect(page.locator('#north-rover')).toBeVisible()
    await expect(page.locator('#north-rover')).toHaveAttribute('direction', 'N')
    await expect(page.locator('#north-rover')).toHaveAttribute('xPosition', '1')
    await expect(page.locator('#north-rover')).toHaveAttribute('yPosition', '3')
  })

  test('should turn left', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)
    await page.locator('#instructions').fill('L')

    await expect(page.locator('#west-rover')).toBeVisible()
    await expect(page.locator('#west-rover')).toHaveAttribute('direction', 'W')
    await expect(page.locator('#west-rover')).toHaveAttribute('xPosition', '1')
    await expect(page.locator('#west-rover')).toHaveAttribute('yPosition', '2')
  })

  test('should turn right', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)
    await page.locator('#instructions').fill('R')

    await expect(page.locator('#east-rover')).toBeVisible()
    await expect(page.locator('#east-rover')).toHaveAttribute('direction', 'E')
    await expect(page.locator('#east-rover')).toHaveAttribute('xPosition', '1')
    await expect(page.locator('#east-rover')).toHaveAttribute('yPosition', '2')
  })

  test('should not permit to move to a coordinate outside the plateau', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)
    await page.locator('#instructions').fill('MMM')

    await expect(page.locator('#north-rover')).toBeVisible()
    await expect(page.locator('#north-rover')).toHaveAttribute('direction', 'N')
    await expect(page.locator('#north-rover')).toHaveAttribute('xPosition', '1')
    await expect(page.locator('#north-rover')).toHaveAttribute('yPosition', '4')
    await page.locator('text="The coordinates you are trying to move forward are outside the plateau. Try another instruction."').isVisible()
  })

  test('should not permit to move to a random coordinate outside the plateau', async ({ page }) => {
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS)
    await page.locator('#instructions').fill('MMMMMMMM')

    await expect(page.locator('#north-rover')).toBeVisible()
    await expect(page.locator('#north-rover')).toHaveAttribute('direction', 'N')
    await expect(page.locator('#north-rover')).toHaveAttribute('xPosition', '1')
    await expect(page.locator('#north-rover')).toHaveAttribute('yPosition', '4')
    await page.locator('text="The coordinates you are trying to move forward are outside the plateau. Try another instruction."').isVisible()
  })
})
