<template>
  <div class="mx-auto container-fluid" style="width: 98%">
    <div
      class="drop_area"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover="dragOver"
      @drop.prevent="dropFile"
      :class="{ enter: isEnter }"
    >
      CSV読み込み
    </div>
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
        <td></td>
        <td></td>
        <td>{{ d.total }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'csv',
  data() {
    return {
      isEnter: false,
      dataset: [],
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
      for (let r of csvData) {
        const room = r['部屋番号']
        const name = r['お名前']
        const total = r['合計金額']

        this.dataset.push({ room: room, name: name, total: total })
      }
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
