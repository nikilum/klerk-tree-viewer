<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

import { NCheckbox, NSpin } from 'naive-ui';
import Rubric from '@/components/rubric/index.vue';

import { RubricatorSingleton } from '@/classes/rubricator.singleton';

import type { Ref, ComputedRef } from 'vue';

const rubrics = new RubricatorSingleton().tree;
const showEmptyRubrics: Ref<boolean> = ref(false);
const loadingRubrics: Ref<boolean> = ref(false);

const totalRubricsCount: ComputedRef<number> = computed(() =>
	new RubricatorSingleton().checkedRubrics.value.reduce(
		(accumulator, id) =>
			accumulator + new RubricatorSingleton().indexedRubrics.value[id].count,
		0,
	),
);

watchEffect(async () => {
	loadingRubrics.value = true;
	new RubricatorSingleton().checkedRubrics.value = [];

	const response = await RubricatorSingleton.fetchRubricatorData(
		showEmptyRubrics.value,
	);
	response.actions.STORE_TREE();

	loadingRubrics.value = false;
});
</script>

<script lang="ts">
export default {
	name: 'Rubricator',
};
</script>

<template>
	<div class="rubricator">
		<h1 class="rubricator__header">Рубрикатор</h1>
		<section class="rubricator__filters">
			<b>Фильтры:</b>
			<n-checkbox v-model:checked="showEmptyRubrics">
				Показывать пустые рубрики
			</n-checkbox>
		</section>
		<section class="rubricator__selected">
			<b>Сумма статей выделеных рубрик:</b> <span>{{ totalRubricsCount }}</span>
		</section>
		<n-spin
			description="Загрузка рубрик..."
			size="small"
			:show="loadingRubrics"
		>
			<ul class="rubricator__list">
				<rubric v-for="rubric of rubrics" :key="rubric.id" :rubric="rubric" />
			</ul>
		</n-spin>
	</div>
</template>

<style lang="scss">
.rubricator {
	max-width: 674px;
	margin: 24px auto;
	padding: 16px 24px;
	border-radius: 8px;
	background: $white;
}

.rubricator__header {
	margin-bottom: 16px;
}

.rubricator__list {
	list-style: none;
	padding-left: 0;
	min-height: 80px;
}

.rubricator__divider {
	margin: 16px 0;
	border: 1px solid $gray-200;
}

.rubricator__filters {
	display: flex;
	flex-direction: column;
	margin: 12px 0;
	padding-top: 12px;
	padding-bottom: 12px;
	border-top: 1px solid $gray-200;
	border-bottom: 1px solid $gray-200;
}

.rubricator__selected {
	margin: 12px 0;
	padding-bottom: 12px;
	border-bottom: 1px solid $gray-200;
}
</style>
