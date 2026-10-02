const fs = require('fs');
const path = 'node_modules/@react-native/gradle-plugin/react-native-gradle-plugin/build.gradle.kts';

let content = fs.readFileSync(path, 'utf8');

const oldBlock = `tasks.withType<KotlinCompile>().configureEach {
  kotlinOptions {
    apiVersion = "1.6"
    // See comment above on JDK 11 support
    jvmTarget = "11"
    allWarningsAsErrors =
        project.properties["enableWarningsAsErrors"]?.toString()?.toBoolean() ?: false
  }
}`;

const newBlock = `tasks.withType<KotlinCompile>().configureEach {
  compilerOptions {
    apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_11)
    allWarningsAsErrors.set(
        project.properties["enableWarningsAsErrors"]?.toString()?.toBoolean() ?: false
    )
  }
}`;

if (!content.includes(oldBlock)) {
  console.log('ERROR: Old kotlinOptions block not found in file.');
  console.log('Searching for partial match...');
  const partialIdx = content.indexOf('kotlinOptions');
  if (partialIdx > -1) {
    console.log('Partial match found at index:', partialIdx);
    console.log('Context (200 chars):');
    console.log(content.substring(partialIdx - 50, partialIdx + 150));
  }
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(path, content);
console.log('SUCCESS: File updated with new compilerOptions DSL');
