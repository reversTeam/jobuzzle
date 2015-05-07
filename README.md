# Generic Framework Front/Back

### Clone du dépot

```bash
git clone git@gitlab.jobuzzle.com:Jobuzzle/Framework.git --recursive
cd Framework
git submodule foreach --recursive git checkout -b g_remote origin/g_remote
git submodule foreach --recursive git checkout master
git checkout -b g_remote origin/g_remote
git remote add generic git@gitlab.jobuzzle.com:Generic/Framework.git
git submodule foreach --recursive npm install
```
