import requests
from requests.auth import HTTPBasicAuth

def get_asic_status(ip, username="root", password="052810080793"):
    try:
        response = requests.get(
            f"http://{ip}/cgi-bin/status.cgi",
            auth=HTTPBasicAuth(username, password),
            timeout=5
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"HTTP {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

def set_avalon_pool(ip, pool_url, worker, password, username="admin", passwd="admin"):
    url = f"http://{ip}/cgi-bin/set_miner_conf.cgi"
    payload = {
        "pools": [
            {
                "url": pool_url,
                "user": worker,
                "pass": password
            }
        ]
    }
    try:
        response = requests.post(url, json=payload, auth=HTTPBasicAuth(username, passwd))
        return response.status_code == 200
    except Exception as e:
        return str(e)

def reboot_asic(ip, username="admin", password="admin"):
    try:
        response = requests.post(
            f"http://{ip}/cgi-bin/miner_reboot.cgi",
            auth=HTTPBasicAuth(username, password)
        )
        return response.status_code == 200
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    import sys
    action = sys.argv[1]
    ip = sys.argv[2]
    if action == "status":
        print(get_asic_status(ip))
    elif action == "set_pool":
        pool_url, worker, password = sys.argv[3:6]
        print(set_avalon_pool(ip, pool_url, worker, password))
    elif action == "reboot":
        print(reboot_asic(ip))
