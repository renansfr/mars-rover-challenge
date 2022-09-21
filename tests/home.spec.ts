import { test, expect, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/')
})

const UPPER_RIGHT_COORDINATES = '5 5'

const ROVER_INITIAL_POSITIONS = [
  '1 2 N',
  '3 3 E',
  '0 0 S'
]

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
    await page.locator('#rover-initial-position').fill(ROVER_INITIAL_POSITIONS[0])

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
