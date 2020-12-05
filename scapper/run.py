from crawlers import run_glassdoor, run_indeed
from concurrent.futures import ProcessPoolExecutor, as_completed
import threading
from utils import db_conn


def r_method(some_string):
    print(f"running {some_string}() functions")
    return eval(f"{some_string}()")


def insert_to_db(payload):
    try:
        db = db_conn()
        db.insert(payload)
    except:
        print("couldn't")


def run():
    run_methods = ["run_indeed"]
    with ProcessPoolExecutor(max_workers=2) as executor:
        futures = {executor.submit(r_method, i): i for i in run_methods}
        for future in as_completed(futures):
            payload = future.result()
            # print(payload)
            insert_to_db(payload)


if __name__ == "__main__":
    run()
