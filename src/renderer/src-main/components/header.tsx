import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderView',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div class="relative w-full h-full flex flex-row items-center pl-3.5 gap-2 electron-drag">
        <span class="text-xs font-semibold mt-px text-foreground/70">{props.title}</span>
      </div>
    )
  }
})
