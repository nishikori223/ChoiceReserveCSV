<template>
  <div class="mx-auto container-fluid" style="width: 98%">
    <header class="clearfix">
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

      <div class="form-inline" v-show="isCompleted">
        <h1 v-show="isCompleted">
          <b>{{ year }}年{{ month }}月分</b>
        </h1>
        <b-button size="sm" variant="outline-dark" @click="csvExport">CSV保存</b-button>
      </div>
    </header>

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
        <td>{{ d.部屋番号 }}</td>
        <td>{{ d.お名前 }}</td>
        <td>{{ d.お食事料金 }}</td>
        <td>{{ d.デリバリー料金 }}</td>
        <td>{{ d.合計 }}</td>
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
            .where((x) => x.部屋番号 == room)
            .toArray()

          if (data.length > 0) {
            if (data[0].お名前.indexOf(name) == -1) {
              data[0].お名前 = data[0].お名前 + ',' + name
            }
            data[0].お食事料金 = data[0].お食事料金 + price
            data[0].デリバリー料金 = data[0].デリバリー料金 + delivery
            data[0].合計 = data[0].お食事料金 + data[0].デリバリー料金
          } else {
            this.dataset.push({
              部屋番号: room,
              お名前: name,
              お食事料金: price,
              デリバリー料金: delivery,
              合計: price + delivery,
            })
          }
        }
      }

      this.dataset = Enumerable.from(this.dataset)
        .orderBy((x) => x.部屋番号)
        .toArray()
      this.isCompleted = true
    },
    csvExport() {
      const csv = this.$papa.unparse(this.dataset)
      const bom = new Uint8Array([0xef, 0xbb, 0xbf])
      const blob = new Blob([bom, csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = this.year + this.month + '.csv'
      link.click()
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
