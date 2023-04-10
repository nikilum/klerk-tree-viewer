import { RubricatorSingleton } from '@/classes/rubricator.singleton';

import type { IRubric } from '@/types/rubric.interface';

class RubricatorService {
	public static calculateRubricCountsWithChildren(rubric: IRubric) {
		let count = 0;

		RubricatorService.walkRubricTree(
			rubric,
			(rubric) => (count += rubric.count),
		);

		return count;
	}

	public static generateIndexedObjectFromRubricsTree(rubrics: IRubric[]): {
		[key: number]: IRubric;
	} {
		const indexedRubricsObject: { [key: number]: IRubric } = {};

		rubrics.forEach((rubric) => {
			RubricatorService.walkRubricTree(
				rubric,
				(rubric) => (indexedRubricsObject[rubric.id] = rubric),
			);
		});

		return indexedRubricsObject;
	}

	public static getRubricChildrenIds(rubric: IRubric): number[] {
		let ids: number[] = [];

		RubricatorService.walkRubricTree(
			rubric,
			(rubric) => ids.push(rubric.id),
			false,
		);

		return ids;
	}

	public static getRubricParentsIds(rubric: IRubric): number[] {
		const rubrics = Object.values(
			new RubricatorSingleton().indexedRubrics.value,
		);
		let lastParentRubric: IRubric = rubric;
		let ids: number[] = [];

		while (lastParentRubric) {
			if (!lastParentRubric) {
				break;
			}

			const parentRubric = rubrics.find((rubricToFind) =>
				rubricToFind.children?.includes(lastParentRubric),
			);

			if (parentRubric) {
				ids.push(parentRubric.id);
			}

			if (!parentRubric) {
				break;
			}

			lastParentRubric = parentRubric;
		}

		return ids;
	}

	private static walkRubricTree(
		rubric: IRubric,
		callback: (rubric: IRubric) => void,
		includeRoot: boolean = true,
	): void {
		const rubricsStack: IRubric[] = [];

		if (includeRoot) {
			rubricsStack.push(rubric);
		} else if (rubric.children) {
			rubricsStack.push(...rubric.children);
		}

		while (rubricsStack.length) {
			const rubricStackPart = rubricsStack.pop();

			if (!rubricStackPart) {
				break;
			}

			callback(rubricStackPart);

			if (rubricStackPart.children && rubricStackPart.children.length) {
				rubricsStack.push(...rubricStackPart.children);
			}
		}
	}
}

export { RubricatorService };
