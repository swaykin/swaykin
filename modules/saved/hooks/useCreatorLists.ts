import { useCallback, useMemo, useState } from "react";
import { LIST_OPTIONS, type SavedListOption } from "../constants";

export const useCreatorLists = () => {
  const [lists, setLists] = useState<SavedListOption[]>(LIST_OPTIONS);

  const listNames = useMemo(() => lists.map((list) => list.name), [lists]);

  const addList = useCallback((name: string) => {
    setLists((prev) =>
      prev.some((list) => list.name === name)
        ? prev
        : [...prev, { name, count: 0 }],
    );
  }, []);

  const removeList = useCallback((name: string) => {
    setLists((prev) => prev.filter((list) => list.name !== name));
  }, []);

  return { lists, listNames, addList, removeList };
};
