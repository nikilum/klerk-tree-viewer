<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui';
import RubricHeader from '@/components/rubric/components/rubric-header/index.vue';

import type { IRubric } from '@/types/rubric.interface';

defineProps<{
	rubric: IRubric;
}>();
</script>

<script lang="ts">
export default {
	name: 'Rubric',
};
</script>

<template>
	<li class="rubric">
		<n-collapse v-if="rubric.children?.length">
			<n-collapse-item class="rubric__collapse-item">
				<template #header>
					<rubric-header :rubric="rubric" />
				</template>

				<ul class="rubric__sublist">
					<rubric
						v-for="child of rubric.children"
						:key="child.id"
						:rubric="child"
					/>
				</ul>
			</n-collapse-item>
		</n-collapse>

		<div v-else class="rubric__empty">
			<rubric-header :rubric="rubric" />
		</div>
	</li>
</template>

<style scoped lang="scss">
.rubric__empty {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-left: 38px;
}

.rubric__sublist {
	list-style: none;
	padding-left: 0;
}

.rubric__collapse-item {
	margin-left: 16px !important;
}

.rubric__collapse-item :deep(.n-collapse-item__content-inner) {
	padding-top: 0 !important;
}
</style>
