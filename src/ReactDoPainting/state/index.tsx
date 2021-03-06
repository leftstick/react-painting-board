import React, { useState, useCallback } from 'react'

import { Color, IDrawMode, IAppContext, IDrawingTool, IShape } from '@/ReactDoPainting/IType'

export const PaintingStateContext = React.createContext<IAppContext | null>(null)

export function PaintingStateProvider(props: any) {
  const [drawing, setDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(IDrawMode.DRAW)
  const [workingDrawTool, setWorkingDrawTool] = useState<IDrawingTool | null>({
    type: 'line',
    drawColor: Color.BLACK,
    drawWidth: 4,
  })
  const [shapes, setShapes] = useState<IShape[]>([])
  const [redoShapes, setRedoShapes] = useState<IShape[]>([])
  const [selectedShape, setSelectedShape] = useState<IShape | null>(null)

  const addShape = useCallback(
    (shape: IShape) => {
      setShapes((sp) => [...sp, shape])
    },
    [setShapes]
  )

  const updateShape = useCallback(
    (id: string, shape: IShape | null) => {
      if (!shape) {
        return
      }
      setShapes((sp) => {
        return sp.map((s) => {
          if (s.id !== id) {
            return s
          }
          return shape
        })
      })

      setSelectedShape((sp) => (sp?.id === id ? shape : sp))
    },
    [setShapes, setSelectedShape]
  )

  const removeShape = useCallback(
    (shapeId: string) => {
      setShapes((sp) => sp.filter((s) => s.id !== shapeId))
      setSelectedShape(null)
    },
    [setShapes, setSelectedShape]
  )

  const cleanRedoShapes = useCallback(() => {
    setRedoShapes([])
  }, [setRedoShapes])

  const undo = useCallback(() => {
    const lastOne = shapes[shapes.length - 1]
    setShapes(shapes.slice(0, -1))

    setRedoShapes((sp) => [...sp, lastOne])
  }, [shapes, setShapes, setRedoShapes])

  const redo = useCallback(() => {
    const lastOne = redoShapes[redoShapes.length - 1]
    setRedoShapes(redoShapes.slice(0, -1))

    setShapes((sp) => [...sp, lastOne])
  }, [redoShapes, setShapes, setRedoShapes])

  const cleanBoard = useCallback(() => {
    setShapes([])
    setRedoShapes([])
  }, [setShapes, setRedoShapes])

  return (
    <PaintingStateContext.Provider
      value={{
        drawing,
        setDrawing,
        drawMode,
        setDrawMode,
        workingDrawTool,
        setWorkingDrawTool,
        shapes,
        addShape,
        updateShape,
        removeShape,
        redoShapes,
        cleanRedoShapes,
        selectedShape,
        setSelectedShape,
        undo,
        redo,
        cleanBoard,
      }}
      {...props}
    />
  )
}
