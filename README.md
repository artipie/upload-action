Artipie upload GitHub action can be used to upload binary artifacts to Artipie using GitHub workflows.

## Usage

Create new `yml` workflow file under `.github/workflows` directory.

*See the example in this repository which uploads file from `./test` directory to central.artipie.com : https://github.com/artipie/upload-action/blob/master/.github/workflows/test-upload.yml*

Here is some explanations:
```yaml
- name: "Upload test file"
  uses: "artipie/upload-action@master"
  with:
    # default server is https://central.artipie.com
    
    # Artipie repository name:
    repo: "artipie/tests"
    
    # Binary artifact to upload
    file: "test/payload.txt"
    
    # Artipie path location
    path: "upload-action-test"
    
    # Artipie username
    username: "${{ secrets.ARTIPIE_USERNAME }}"
    # Artipie password
    password: "${{ secrets.ARTIPIE_PASSWORD }}"
```

## Options


| Option        | Optional | Description                    | Default value               |
|:------------- |:---------|:-------------------------------|:----------------------------|
| `server`      | yes      | Artipie server base URL        | https://central.artipie.com |
| `repo`        | no       | Artipie repository coordinates |                             |
| `file`        | no       | File to upload                 |                             |
| `path`        | yes      | Artipie path in repository     | `file` name                 |
| `username`    | yes      | Artipie username               |                             |
| `password`    | yes      | Artipie password               |                             |

