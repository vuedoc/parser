<script>
function stringToDate(str) {
  const [y, m, d] = str.split('-');

  return new Date(+y, m - 1, +d);
}

function dateToString(date) {
  return (
    date.getFullYear()
    + '-'
    + pad(date.getMonth() + 1)
    + '-'
    + pad(date.getDate())
  );
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s;
}

export default {
  data() {
    return {
      flightType: 'one-way flight',
      departureDate: dateToString(new Date()),
      /**
       * @ignore
       */
      returnDate: dateToString(new Date()),
    };
  },
  computed: {
    isReturn() {
      return this.flightType === 'return flight';
    },
    canBook() {
      return (
        !this.isReturn
        || stringToDate(this.returnDate) > stringToDate(this.departureDate)
      );
    },
  },
  methods: {
    book() {
      alert(
        this.isReturn
          ? `You have booked a return flight leaving on ${this.departureDate} and returning on ${this.returnDate}.`
        	: `You have booked a one-way flight leaving on ${this.departureDate}.`
      );
    },
  },
};

</script>

<template>
<select v-model="flightType">
  <option value="one-way flight">One-way Flight</option>
  <option value="return flight">Return Flight</option>
</select>

<input type="date" v-model="departureDate"/>
<input type="date" v-model="returnDate" :disabled="!isReturn"/>

<button :disabled="!canBook" @click="book">Book</button>

<p>{{ canBook ? '' : 'Return date must be after departure date.' }}</p>

</template>

<style>
select,
input,
button {
  display: block;
  margin: 0.5em 0;
  font-size: 15px;
}

input[disabled] {
  color: #999;
}

p {
  color: red;
}
</style>