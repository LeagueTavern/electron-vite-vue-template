import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainWindow',
  setup(_, { slots }) {
    return () => (
      <div class="relative w-full h-screen overflow-hidden flex flex-col">
        <div class="relative h-8 box-content border-b border-[#272A30]">
          {slots.header && slots.header()}
        </div>
        <div class="relative flex-1">{slots.default && slots.default()}</div>
      </div>
    )
  }
})
