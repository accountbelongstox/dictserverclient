from kernel.base.base import *


# import os
class Main(Base):
    def __init__(self, argv):
        pass

    def main(self, argv):
        self.com_thread.create_thread("flask", {"module": self}, run=True)


