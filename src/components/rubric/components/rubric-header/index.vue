<script setup lang="ts">
import { computed } from 'vue';

import { NA, NCheckbox } from 'naive-ui';

import { RubricatorSingleton } from '@/classes/rubricator.singleton';
import { RubricatorService } from '@/classes/rubricator.service';

import type { ComputedRef } from 'vue';
import type { IRubric } from '@/types/rubric.interface';

const props = defineProps<{
	rubric: IRubric;
}>();

const baseUrl = import.meta.env.VITE_BASE_URL;
const checkedRubrics = new RubricatorSingleton().checkedRubrics;

const totalCount: ComputedRef<number> = computed(() =>
	RubricatorService.calculateRubricCountsWithChildren(props.rubric),
);
const isChecked: ComputedRef<boolean> = computed(() => {
	return checkedRubrics.value.includes(props.rubric.id);
});
const hasCheckedChildren: ComputedRef<boolean> = computed(() => {
	const childrenIds = RubricatorService.getRubricChildrenIds(props.rubric);

	const childrenIdsWithSelectedIds = [...childrenIds, ...checkedRubrics.value];

	return (
		new Set(childrenIdsWithSelectedIds).size !==
		childrenIdsWithSelectedIds.length
	);
});

function checkRubric() {
	const childrenIds = RubricatorService.getRubricChildrenIds(props.rubric);
	const parentsIds = RubricatorService.getRubricParentsIds(props.rubric);

	if (!isChecked.value) {
		checkedRubrics.value.push(props.rubric.id);

		if (props.rubric.id) {
			checkedRubrics.value.push(...childrenIds);
			checkedRubrics.value = Array.from(new Set(checkedRubrics.value));
		}

		parentsIds.forEach((parentId) => {
			const parent = new RubricatorSingleton().indexedRubrics.value[parentId];
			const parentChildrenIds = RubricatorService.getRubricChildrenIds(parent);
			const checkedIdsWithParentChildrenIds = [
				...parentChildrenIds,
				...checkedRubrics.value,
			];

			if (
				checkedIdsWithParentChildrenIds.length -
					new Set(checkedIdsWithParentChildrenIds).size ===
				parentChildrenIds.length
			) {
				checkedRubrics.value.push(parentId);
			}
		});

		return;
	}

	const idsToRemoveFromSelectedIdsArray = [
		...childrenIds,
		...parentsIds,
		props.rubric.id,
	];

	checkedRubrics.value = checkedRubrics.value.filter(
		(rubricId) => !idsToRemoveFromSelectedIdsArray.includes(rubricId),
	);
}
</script>

<script lang="ts">
export default {
	name: 'RubricHeader',
};
</script>

<template>
	<div class="rubric-header">
		<n-checkbox
			:checked="isChecked"
			:indeterminate="!isChecked && hasCheckedChildren"
			@click.stop="checkRubric"
		>
			<n-a
				:href="baseUrl + rubric.url"
				target="_blank"
				class="rubric-header__link"
				@click.stop
			>
				{{ rubric.title }}: <span>{{ rubric.count }}</span>
			</n-a>
		</n-checkbox>

		<span class="rubric-header__divider"></span>
		<span>{{ totalCount }}</span>
	</div>
</template>

<style scoped lang="scss">
.rubric-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.rubric-header__link,
.rubric-header__name {
	white-space: nowrap;
}

.rubric-header__divider {
	width: 100%;
	margin: 0 16px;
	border-bottom: 1px solid lightgray;
}
</style>
