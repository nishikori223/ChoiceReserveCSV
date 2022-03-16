<template>
  <div class="mx-auto container-fluid" style="width: 98%">
    <div
      v-show="!isCompleted"
      class="drop_area"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover="dragOver"
      @drop.prevent="dropFile"
      :class="{ enter: isEnter }"
    >
      CSV読み込み
    </div>
    <h1 style="text-align: left" v-show="isCompleted">
      <b>{{ year }}年{{ month }}月分</b>
    </h1>
    <br />
    <table class="table table-sm table-striped table-hover no-footer">
      <thead>
        <tr>
          <th scope="col">部屋番号</th>
          <th scope="col">お名前</th>
          <th scope="col">お食事料金</th>
          <th scope="col">デリバリー料金</th>
          <th scope="col">合計</th>
        </tr>
      </thead>
      <tr v-for="(d, i) in dataset" :key="i">
        <td>{{ d.room }}</td>
        <td>{{ d.name }}</td>
        <td>{{ d.price }}</td>
        <td>{{ d.delivery }}</td>
        <td>{{ d.price + d.delivery }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Enumerable from 'linq'
export default {
  name: 'csv',
  data() {
    return {
      isEnter: false,
      dataset: [],
      year: '',
      month: '',
      isCompleted: false,
    }
  },
  methods: {
    dragEnter() {
      this.isEnter = true
    },
    dragLeave() {
      this.isEnter = false
    },
    dragOver(e) {
      e.preventDefault()
    },
    dropFile(e) {
      this.isEnter = false
      const file = e.dataTransfer.files[0]
      if (!file.type.match('application/vnd.ms-excel') || !file.name.startsWith('reservation_')) {
        alert('ファイルが違います')
        return
      }

      this.$papa.parse(file, {
        header: true,
        encoding: 'Shift-JIS',
        complete: this.loadData,
      })
    },
    loadData(results) {
      const csvData = results.data
      this.year = csvData[0]['予約日'].substr(0, csvData[0]['予約日'].indexOf('/'))
      this.month = csvData[0]['予約日'].substr(csvData[0]['予約日'].indexOf('/') + 1, 2)
      for (let r of csvData) {
        // EOFが空行の為
        if (r['予約番号']) {
          const month = r['予約日'].substr(r['予約日'].indexOf('/') + 1, 2)
          if (this.month != month) {
            alert('月が跨っています。')
            this.dataset = []
            return
          }
          const room = r['部屋番号']
          const name = r['お名前']
          let delivery = r['メインメニュー'].indexOf('デリバリー') > -1 ? r['予約数'] * 100 : 0
          let price = Number(r['合計金額']) - delivery

          let data = Enumerable.from(this.dataset)
            .where((x) => x.room == room)
            .toArray()

          if (data.length > 0) {
            if (data[0].name.indexOf(name) == -1) {
              data[0].name = data[0].name + ',' + name
            }
            data[0].price = data[0].price + price
            data[0].delivery = data[0].delivery + delivery
          } else {
            this.dataset.push({ room: room, name: name, price: price, delivery: delivery })
          }
        }
      }

      this.dataset = Enumerable.from(this.dataset)
        .orderBy((x) => x.room)
        .toArray()
      this.isCompleted = true
    },
  },
}
</script>

<style scoped>
.drop_area {
  color: gray;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100px;
  border: 5px solid gray;
  border-radius: 15px;
}
.enter {
  border: 10px dotted powderblue;
}
</style>
