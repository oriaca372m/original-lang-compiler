	.text

# 整数を文字列に変換する。ただし反転している
# input:
#   %r8 整数
# output:
#   $text_buf 出力先
#   %r9 使用したバッファのサイズ
itoa:
	movq $0, %rcx
	movq %r8, %rax
	movq $10, %r11

itoa_loop:
	movq $0, %rdx
	divq %r11

	# '0' + %rdx
	addq $48, %rdx

	movb %dl, text_buf(%rcx)

	incq %rcx

	# %rax == 0 ならループ終了
	cmpq $0, %rax
	je iota_end

	jmp itoa_loop

iota_end:
	mov %rcx, %r9
	ret

# バッファの中身を反転させる
# input:
#   %text_buf 入力元
#	%r9 バッファのサイズ
# output:
#   $text_buf 出力先
reverse_buf:
	# 終了条件の計算 %r11 = %r9 / 2
	movq $0, %rdx
	movq %r9, %rax
	movq $2, %r11
	divq %r11
	movq %rax, %r11

	movq $0, %rcx

reverse_buf_loop:
	movq %r9, %rax
	subq %rcx, %rax
	decq %rax

	# before byte
	movb text_buf(%rcx), %dl
	# after byte
	movb text_buf(%rax), %dil

	movb %dl, text_buf(%rax)
	movb %dil, text_buf(%rcx)

	incq %rcx
	cmpq %rcx, %r11
	jle reverse_buf_end

	jmp reverse_buf_loop

reverse_buf_end:
	ret

print_new_line:
	movq $1, %rax
	movq $1, %rdi
	movq $new_line, %rsi
	movq $1, %rdx
	syscall
	ret

# %r8 レジスタを文字列として出力し、改行する
print_number:
	call itoa
	call reverse_buf

	# print text_buf
	movq $1, %rax
	movq $1, %rdi
	movq $text_buf, %rsi
	movq %r9, %rdx
	syscall

	call print_new_line

	ret

# 文字列+改行を標準出力に出力する
# input:
#	%r8 出力するバッファ
#	%r9 バッファのサイズ
print_string:
	movq $1, %rax
	movq $1, %rdi
	movq %r8, %rsi
	movq %r9, %rdx
	syscall

	call print_new_line

	ret

# ヌル終端文字列の長さを知る
# input:
#	%r8 文字列へのバッファ
# output:
#	%r9 文字列のサイズ
strlen:
	movq $0, %rcx
	movq %r8, %rbx

strlen_loop:
	incq %rcx

	cmpb $0, (%rbx, %rcx)
	jne strlen_loop

	movq %rcx, %r9
	ret

# 2つの整数が等しいか比較する
# input:
#	%r8 数値1
#	%r9 数値2
# output:
#	%r10 結果
equals2nums:
	cmpq %r8, %r9
	je equals2nums_equal

	movq $0, %r10
	ret

equals2nums_equal:
	movq $1, %r10
	ret

# %r8 < %r9
# input:
#	%r8 数値1
#	%r9 数値2
# output:
#	%r10 結果
lesserThan:
	movq $1, %r10
	cmpq %r9, %r8
	jl lesserThan_true
	movq $0, %r10
	ret

lesserThan_true:
	movq $1, %r10
	ret

# === 組み込み関数 ===
.global __builtIn_add
__builtIn_add:
	movq 16(%rsp), %r8
	movq 8(%rsp), %r9
	addq %r9, %r8
	movq %r8, 24(%rsp)
	ret

.global __builtIn_mul
__builtIn_mul:
	movq 16(%rsp), %rax
	movq 8(%rsp), %r8
	mulq %rax
	movq %rax, 24(%rsp)
	ret

.global __builtIn_equals2nums
__builtIn_equals2nums:
	movq 16(%rsp), %r8
	movq 8(%rsp), %r9
	call equals2nums
	movq %r10, 24(%rsp)
	ret

.global __builtIn_lesserThan
__builtIn_lesserThan:
	movq 16(%rsp), %r8
	movq 8(%rsp), %r9
	call lesserThan
	movq %r10, 24(%rsp)
	ret

.global __builtIn_print_number
__builtIn_print_number:
	movq 8(%rsp), %r8
	call print_number
	ret

.global __builtIn_print_string_length
__builtIn_print_string_length:
	movq 16(%rsp), %r8
	movq 8(%rsp), %r9
	call print_string
	ret

.global __builtIn_strlen
__builtIn_strlen:
	movq 8(%rsp), %r8
	call strlen
	movq %r9, 16(%rsp)
	ret

# メイン
.global _start
_start:
	addq $8, %rsp
	call _main

	# exit
	movq $60, %rax
	popq %rdi
	syscall

	.bss
.lcomm text_buf, 10

	.data
new_line:
	.ascii "\n"
hello:
	.ascii "hello"

	.text
# vim: ft=asm
