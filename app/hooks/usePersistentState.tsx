import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { JSONValue } from "~/lib/types";

export type PersistentStatePersistence = "local" | "session";

export type PersistentStateChangeEvent = CustomEvent<{
  persistence: PersistentStatePersistence;
  key: string;
}>;

declare global {
  interface WindowEventMap {
    "persistent-state-change": PersistentStateChangeEvent;
  }
}

export type UsePersistentStateProps<T extends JSONValue> = {
  persistence: PersistentStatePersistence;
  key: string;
  defaultValue: T;
};

export type UsePersistentStateResult<T extends JSONValue> = [
  T,
  Dispatch<SetStateAction<T>>,
];

export function usePersistentState<T extends JSONValue>({
  persistence,
  key,
  defaultValue,
}: UsePersistentStateProps<T>): UsePersistentStateResult<T> {
  const storage = useMemo(() => getStorage(persistence), [persistence]);
  const [state, _setState] = useState(deserialize<T>(storage.getItem(key)));

  const setState = useCallback<UsePersistentStateResult<T>[1]>(
    (value) => {
      setPersistentValue({
        key,
        persistence,
        value: value instanceof Function ? value(state) : value,
      });
    },
    [key, persistence, state],
  );

  useEffect(() => {
    const listener = (event: PersistentStateChangeEvent) => {
      if (
        event.detail.key === key &&
        event.detail.persistence === persistence
      ) {
        _setState(deserialize<T>(storage.getItem(key)));
      }
    };

    addEventListener("persistent-state-change", listener);

    return () => removeEventListener("persistent-state-change", listener);
  }, [key, persistence, storage]);

  return [state ?? defaultValue, setState];
}

function getStorage(persistence: PersistentStatePersistence) {
  switch (persistence) {
    case "local":
      return localStorage;
    case "session":
      return sessionStorage;
  }
}

function serialize<T extends JSONValue>(value: T): string | null {
  return value === null ? value : JSON.stringify(value);
}

function deserialize<T extends JSONValue>(value: string | null): T {
  return JSON.parse(value ?? "null");
}

export function getPersistentValue<T extends JSONValue>({
  key,
  persistence,
}: Omit<UsePersistentStateProps<T>, "defaultValue">): T | null {
  const storage = getStorage(persistence);

  return deserialize(storage.getItem(key));
}

export function setPersistentValue<T extends JSONValue>({
  key,
  persistence,
  value,
}: Omit<UsePersistentStateProps<T>, "defaultValue"> & { value: T | null }) {
  const storage = getStorage(persistence);
  const newValue = serialize(value);

  if (newValue !== null) storage.setItem(key, newValue);
  else storage.removeItem(key);

  dispatchEvent(
    new CustomEvent("persistent-state-change", {
      detail: { key, persistence },
    }) as PersistentStateChangeEvent,
  );
}
