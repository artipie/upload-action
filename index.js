/*
 * MIT License
 *
 * Copyright (c) 2020 Artipie
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// main initialize GitHub actions core API and GitHub API
// to start action func with specified dependencies.
// Reports action failure on error.
function main(action) {
  const core = require('@actions/core');
  const github = require('@actions/github');
  try {
    action(core, github);
  } catch (err) {
    core.setFailed(err.message);
  }
}

// GitHub action entry point.
function artipieUpload(core, github) {
  const server = core.getInput('server');
  const repo = core.getInput('repo');
  const file = core.getInput('file');
  let name = core.getInput('path');
  if (!name) {
    name = file;
  }
  const url = new URL(`${server}/${repo}/${name}`);
  const options = {
    host: url.host,
    port: url.port,
    path: url.pathname,
    protocol: url.protocol,
    followAllRedirects: true,
    method: 'PUT'
  };
  const username = core.getInput('username');
  if (username) {
    const password = core.getInput('password');
    options['Authorization'] = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  }
  const http = require('http');
  const req = http.request(options, (res) => {
    if (res.statusCode == 201) {
      core.info(`File ${file} was successfully uploaded to ${url}`);
    } else {
      core.error(`Failed to upload file ${file}: ${res.statusCode}`);
      core.setFailed('Upload failed');
    }
  });
  req.on('error', function (err) {
    core.error(`Failed to upload file ${file}: ${err}`);
    core.setFailed(err.message);
  });
  const fs = require('fs');
  const data = fs.readFileSync(file);
  req.write(data);
  req.end();
}


main(artipieUpload);
