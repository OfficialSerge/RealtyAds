## Coding Challenge Overview

### Init
I started by declaring some variables in the global scope, I figured by defining the layout `obj` 
here that I wouldn't have to check for undefined values later on in the code, making it cleaner and easier to read.
```javascript
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
```

I also made use of the Collator class, a useful tool for language sensitive string comparison [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator).
```javascript
const coll = new Intl.Collator('en', { sensitivity: 'base' })
```

### Event loop
```javascript
  events.forEach((event) => {
    // count event colors in June and March

    // seek out global min date name

    // seek out global min value name

    // tally high-value names

    // compute value sum
  })
```

I made use of the Date object to parse out useful information like the month *(0 - 11 not 1 - 12)* and year. 
I used this information to index into the JSON object so I could then increment the counter for each color
of the 2 months in question.
```javascript
    const dateTimeObject = new Date(event.date)
    const month = dateTimeObject.getMonth() // 0-11
    const year = dateTimeObject.getFullYear() 

    // count June and March events
    if (month == 5 || month == 2) {
      const key = `color_freq_${year}_0${month + 1}`
      obj['task1'][key][event.color] += 1
    }
```

Next we check if the current date is our new global min date, if it is, then we assign it as the new min date,
next we assign the name of the new min date, making sure to break any ties using the Collator object we defined
above.
```javascript
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
```

Now we perform essentially the same logic except that instead of the date, we're looking for the min value,
all else is virtually idential.
```javascript
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
```

Finally we filter out for high values and push their names into `high_value_names` when present.
```javascript
    // tally high-value names
    if (event.value > 25) {
      existsDetailsA && obj['task2']['high_value_names'].push(existsDetailsA.name)
      existsDetailsB && obj['task2']['high_value_names'].push(existsDetailsB.name)
    }

    sumValues += event.value
```

### Assumptions
I looked carefully at `references.json` and `event_details.json` and noticed a few things.
- all March months occured in 2025 and all June months took place in 2024, thus we can hard code the dates in for the two.
- "RED", "BLUE", and "GREEN" were the only colors in each event, therefore the initial value is the set of the three of them set to 0, so we hardcode that too.
- it would appear that each event was either linked to a reference `id_a` or `id_b` but *never both*, meaning you'll only ever encounter event details from `id_a` or `id_b`, thus we don't need to consider the case where both are defined, however this might be something worth exploring down the line.

### AI Prompts
It was somewhat helpful but I did the majority of this without it, although I was able to learn more about the Collator object from GPT-5.

*I'd like to recruit your help in understanding string comparison and relational operators. Given two strings in JavaScript, would using the relational operator "abc" < "bce" allow you to assert whether the first string came before the second alphabetically?*\
...\
*I ask because I'm looking to break ties between similar strings, for example "cat" and "car", by sorting them alphabetically. I also need a proper starting value for the min-string variables so that localeCompare returns true at first.*

