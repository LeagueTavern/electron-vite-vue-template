import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainContainer',
  setup(_, { slots }) {
    return () => (
      <div class="relative w-full h-full overflow-hidden flex flex-row">
        <div class="relative w-60 box-content border-r border-[#272A30]">
          {slots.sidebar && slots.sidebar()}
        </div>
        <div class="relative flex-1">{slots.content && slots.content()}</div>
      </div>
    )
  }
})
