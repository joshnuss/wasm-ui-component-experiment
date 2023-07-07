(module 
  (import "nodes" "createElement" (func $nodes/createElement (param i32 i32)))
  (import "nodes" "createTextNode" (func $nodes/createTextNode (param i32 i32)))
  (import "nodes" "appendChild" (func $nodes/appendChild (param i32 i32)))
  (import "nodes" "removeChild" (func $nodes/removeChild (param i32 i32)))
  (import "nodes" "setAttribute" (func $nodes/setAttribute (param i32 i32 i32 i32 i32)))
  (import "nodes" "addEventListener" (func $nodes/addEventListener (param externref i32 i32 i32) (result externref)))
  (import "js" "mem" (memory 1))

  (data (i32.const 0) "div")
  (data (i32.const 3) "h1")
  (data (i32.const 5) "style")
  (data (i32.const 10) "color: red")
  (data (i32.const 21) "hello wasm!")

  (export "create" (func $create))
  (export "mount" (func $mount))
  (export "update" (func $update))
  (export "detach" (func $detach))

  (func $create
    ;; div element
    i32.const 0 ;; offset
    i32.const 3 ;; length
    call $nodes/createElement

    ;; h1 element
    i32.const 3 ;; offset
    i32.const 2 ;; length
    call $nodes/createElement

    ;; text node
    i32.const 20 ;; offset
    i32.const 12 ;; length
    call $nodes/createTextNode

    ;; style attribute
    i32.const 1
    i32.const 5 ;; offset
    i32.const 5 ;; length
    i32.const 10 ;; offset
    i32.const 10 ;; length
    call $nodes/setAttribute
  )

  (func $mount
    i32.const -1 ;; -1 is the target node
    i32.const 0 ;; element at 0 index
    call $nodes/appendChild

    i32.const 0
    i32.const 1
    call $nodes/appendChild

    i32.const 1
    i32.const 2
    call $nodes/appendChild
  )

  (func $update (result i32)
    i32.const 22
    ;; i32.const 0 ;; set index
    ;; call $api/changed
    ;; (if
    ;;   (then
    ;;     i32.const 0 ;; set index
    ;;     ;; for text
    ;;     call $nodes/updateData
    ;;     ;; for attibute
    ;;     call $nodes/setAttribute
    ;;   )
    ;; )
  )

  (func $detach
    i32.const -1 ;; -1 is the target node
    i32.const 0 ;; element at 0 index
    call $nodes/removeChild
    return
  )
)
