OBJDIR := build
SRCS := $(wildcard *.s)
OBJS := $(addprefix $(OBJDIR)/, $(SRCS:.s=.o))

.PHONY: default
default: all

$(OBJDIR)/%.o: %.s
	as -o $@ $<

$(OBJDIR)/a.out: $(OBJS)
	ld -o $@ $^

.PHONY: all
all: $(OBJDIR)/a.out

$(OBJS): | $(OBJDIR)

$(OBJDIR):
	mkdir -p $(OBJDIR)

.PHONY: run
run: all
	./$(OBJDIR)/a.out

.PHONY: clean
clean:
	rm -rf ./build/
