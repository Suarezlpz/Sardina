import React, { useEffect, useState } from 'react';
import Mousetrap from 'mousetrap';
import { HotkeyActivoAtom } from '../atoms/HotkeyActivoAtom';
import { useAtom } from 'jotai';

const HotKey = () => {

    const [hotkeyActivo, setHokeyActivo] = useAtom(HotkeyActivoAtom);

  useEffect(() => {
    // Bind a key combination
    Mousetrap.bind('ctrl+c', () => {
      setHokeyActivo(true);
    });

    // Cleanup on unmount
    return () => {
      Mousetrap.unbind('ctrl+c');
    };
  }, []);

  return (
    ''
  );
};

export default HotKey;