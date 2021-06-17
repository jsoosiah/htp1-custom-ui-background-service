<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h1>HTP-1 Background Service</h1>
        <h2>Connect</h2>
        <form @submit.prevent="validateAndSetWebsocketurl(ipAddressText)">
          <div class="mb-3">
            <label for="htp1ip" class="form-label">HTP-1 IP Address</label>
            <input
              list="ipList"
              type="text"
              v-model="ipAddressText"
              class="form-control"
              id="htp1ip"
              aria-describedby="ipHelp"
            />
            <datalist id="ipList">
              <option v-for="ip in ipList" :value="ip" :key="ip" />
            </datalist>
            <div v-if="state === 'OPEN'" id="ipHelp" class="form-text text-success">
              Connected to {{ mso.unitname }}@{{ websocketIp }}.
            </div>
            <div v-else class="form-text">Not connected.</div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="ipAddressText === websocketIp">
            Save
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h2>Event Log</h2>
        <div class="table-responsive">
          <table class="table table-hover table-sm table-striped small">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <!-- <th scope="col">Reason</th> -->
                <th scope="col">New Value</th>
                <th scope="col">Previous Value</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in eventLog" :key="item.time">
                <td>{{ item.event }}</td>
                <!-- <td>{{item.reason}}</td> -->
                <td>{{ item.new }}</td>
                <td>{{ item.old }}</td>
                <td>{{ item.time.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from 'vue';

import useMso from '@/use/useMso.js';
import useWebSocket from '@/use/useWebSocket.js';

export default {
  name: 'App',
  setup() {
    const { websocketIp, findServers, setWebsocketIp } = useWebSocket();

    const { mso, state, setUpmix, upmixLabels, setLipsyncDelay, currentDiracSlot, setDiracSlot } =
      useMso();
    const ipAddressText = ref(websocketIp.value);
    const ipSet = ref(new Set());
    const ipList = ref([]);

    const eventLog = ref([]);

    onMounted(() => {
      if (websocketIp.value) {
        ipSet.value.add(websocketIp.value);
      }

      window.window.ipcRenderer.receive('ipListFromMain', (ipListFromMain) => {
        for (const ip of ipListFromMain) {
          ipSet.value.add(ip);
        }

        ipList.value = [...ipSet.value];

        if (!websocketIp.value) {
          findServers(ipList.value, 4000);
        }
      });
    });

    function validateAndSetWebsocketurl(url) {
      // todo: if valid
      setWebsocketIp(url);
    }

    function applyDefaultsForCurrentInput(reason) {
      // apply default upmix if one is defined
      if (
        currentInput?.value?.defaultUpmix &&
        currentInput?.value?.defaultUpmix !== mso.value.upmix.select
      ) {
        eventLog.value.unshift({
          event: `Apply Default Upmix for ${currentInput?.value?.label}`,
          reason: reason,
          old: upmixLabels[mso.value.upmix.select],
          new: upmixLabels[currentInput?.value?.defaultUpmix],
          time: new Date(),
        });

        setUpmix(currentInput?.value?.defaultUpmix);
      }

      // apply input delay if different from current delay
      if (
        typeof currentInput?.value?.delay === 'number' &&
        currentInput?.value?.delay !== mso?.value?.cal?.lipsync
      ) {
        eventLog.value.unshift({
          event: `Apply Delay for ${currentInput?.value?.label}`,
          reason: reason,
          old: `${mso?.value?.cal?.lipsync} ms`,
          new: `${currentInput?.value?.delay} ms`,
          time: new Date(),
        });

        setLipsyncDelay(currentInput?.value?.delay);
      }

      // apply dirac slot if needed
      if (
        typeof currentInput?.value?.diracslot === 'number' &&
        currentInput?.value?.diracslot !== mso.value.cal?.currentdiracslot
      ) {
        eventLog.value.unshift({
          event: `Apply Dirac Slot for ${currentInput?.value?.label}`,
          reason: reason,
          old: currentDiracSlot.value.name,
          new: mso.value.cal.slots[currentInput?.value?.diracslot].name,
          time: new Date(),
        });

        setDiracSlot(currentInput?.value?.diracslot);
      }

      while (eventLog.value.length > 50) {
        eventLog.value.pop();
      }
    }

    const powerIsOn = computed(() => {
      return mso?.value?.powerIsOn;
    });

    const currentInput = computed(() => {
      if (mso?.value?.inputs) {
        return mso?.value?.inputs[mso?.value?.input];
      }

      return null;
    });

    watch(
      () => powerIsOn.value,
      (newPower, oldPower) => {
        applyDefaultsForCurrentInput('Power State Changed');
      }
    );

    watch(
      () => currentInput.value,
      (newInput, oldInput) => {
        if (mso && newInput?.label && oldInput?.label) {
          applyDefaultsForCurrentInput('Input Changed');
        }
      }
    );

    watch(state, () => {
      if (state.value === 'OPEN') {
        console.log('send connected true?');
        window.ipcRenderer.send('connected', true);
      } else {
        console.log('send connected false?');
        window.ipcRenderer.send('connected', false);
      }
    });

    watch(websocketIp, () => {
      ipAddressText.value = websocketIp.value;
    });

    return {
      mso,
      powerIsOn,
      currentInput,
      state,
      websocketIp,
      ipAddressText,
      ipList,
      validateAndSetWebsocketurl,
      eventLog,
    };
  },
};
</script>

<style scoped></style>
