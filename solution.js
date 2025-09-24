import events from './event_details.json' with { type: 'json' }
import refs from './references.json' with { type: 'json' }

let sumValues = 0
let minDateName = null
let minValueName = null
let minDate = Number.MAX_VALUE
let minValue = Number.MAX_VALUE

let obj = {
  task1: {
    color_freq_2024_06: { RED: 0, BLUE: 0, GREEN: 0 },
    color_freq_2025_03: { RED: 0, BLUE: 0, GREEN: 0 },
  },
  task2: {
    sum_value: 0,
    earliest_date_name: '',
    min_value_name: '',
    high_value_names: [],
  },
}

// note null or undefined values return 1, as in null 
// or undefined is greater than the second argument
const coll = new Intl.Collator('en', { sensitivity: 'base' })

function solution() {
  events.forEach((event) => {
    const dateTimeObject = new Date(event.date)
    const month = dateTimeObject.getMonth() // 0-11
    const year = dateTimeObject.getFullYear() 

    // count June and March events
    if (month == 5 || month == 2) {
      const key = `color_freq_${year}_0${month + 1}`
      obj['task1'][key][event.color] += 1
    }

    const existsDetailsA = refs.find((element) => element.id_a == event.id_a)
    const existsDetailsB = refs.find((element) => element.id_b == event.id_b)

    // seek out global min date name
    const now = dateTimeObject.getTime()
    if (now <= minDate) {
      minDate = now

      if (now == minDate) {
        minDateName = coll.compare(existsDetailsA?.name, minDateName) < 0 ? existsDetailsA.name : minDateName
        minDateName = coll.compare(existsDetailsB?.name, minDateName) < 0 ? existsDetailsB.name : minDateName
      } else {
        minDateName = existsDetailsA ? existsDetailsA.name : minDateName
        minDateName = existsDetailsB ? existsDetailsB.name : minDateName
      }
    }

    // seek out global min value name
    if (event.value <= minValue) {
      minValue = event.value

      if (event.value == minValue) {
        minValueName = coll.compare(existsDetailsA?.name, minValueName) < 0 ? existsDetailsA.name : minValueName
        minValueName = coll.compare(existsDetailsB?.name, minValueName) < 0 ? existsDetailsB.name : minValueName
      } else {
        minValueName = existsDetailsA ? existsDetailsA.name : minValueName
        minValueName = existsDetailsB ? existsDetailsB.name : minValueName
      }
    }

    // tally high-value names
    if (event.value > 25) {
      existsDetailsA && obj['task2']['high_value_names'].push(existsDetailsA.name)
      existsDetailsB && obj['task2']['high_value_names'].push(existsDetailsB.name)
    }

    sumValues += event.value
  })

  obj['task2']['sum_value'] = sumValues
  obj['task2']['earliest_date_name'] = minDateName
  obj['task2']['min_value_name'] = minValueName

  console.log(obj)
}

solution()
