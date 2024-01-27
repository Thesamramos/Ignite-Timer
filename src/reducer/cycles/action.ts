import { Cycle } from "./reducer";

export enum AcitonType {
    ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
    INTERRUPT_CYCLE = 'INTERRUPT_CYCLE',
    MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function addNewCycleAction(newCycle: Cycle) {
    return {
        type: AcitonType.ADD_NEW_CYCLE,
        payload: {
            newCycle,
        },
    }
}

export function markCurrentCycleAsFinishedAction() {
    return {
        type: AcitonType.MARK_CURRENT_CYCLE_AS_FINISHED
    }
}

export function interruptCycleAction() {
    return {
        type: AcitonType.INTERRUPT_CYCLE
    }
}