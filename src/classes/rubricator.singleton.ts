import { ref, computed } from 'vue';

import { HttpClientSingleton } from '@/classes/http-client.singleton';
import { RubricatorService } from '@/classes/rubricator.service';

import type { Ref, ComputedRef } from 'vue';
import type { AxiosResponse } from 'axios';
import type { IRubric } from '@/types/rubric.interface';
import type { IStorableResponse } from '@/types/storable-response.interface';

class RubricatorSingleton {
	private static instance: RubricatorSingleton = new RubricatorSingleton();
	public tree: Ref<IRubric[]> = ref([]);
	public checkedRubrics: Ref<number[]> = ref([]);

	public indexedRubrics: ComputedRef<{ [key: number]: IRubric }> = computed(
		() =>
			RubricatorService.generateIndexedObjectFromRubricsTree(
				new RubricatorSingleton().tree.value,
			),
	);

	constructor() {
		return RubricatorSingleton.instance;
	}

	public static async fetchRubricatorData(
		allowEmpty: boolean = false,
	): Promise<IStorableResponse<AxiosResponse<IRubric[]>, 'STORE_TREE'>> {
		const response = await HttpClientSingleton.get<IRubric[]>(
			'/event/rubrics',
			allowEmpty ? { params: { allowEmpty } } : {},
		);

		return {
			response,

			actions: {
				STORE_TREE: () => {
					new RubricatorSingleton().tree.value = response.data;
				},
			},
		};
	}
}

export { RubricatorSingleton };
