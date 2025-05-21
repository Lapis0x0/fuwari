import { visit } from "unist-util-visit";

/**
 * Handles directives of the name `audio`.
 * Expected Markdown syntax: `!audio[alt text](audio_url "optional title")`
 *
 * - `node.name` should be "audio".
 * - `node.children` would contain "alt text" (currently ignored).
 * - `node.attributes.default` is expected to contain 'audio_url "optional title"'.
 *
 * Transforms the directive node into an <audio-player> element
 * that Astro can then map to the AudioPlayer.astro component.
 */
export function rehypeComponentAudio() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        (node.type === "textDirective" ||
          node.type === "leafDirective" ||
          node.type === "containerDirective") &&
        node.name === "audio"
      ) {
        const attributes = node.attributes || {};
        let audio_url = "";
        let title = "";

        // Assuming `!audio[alt text](audio_url "optional title")` results in:
        // node.name = "audio"
        // node.attributes.default = 'audio_url "optional title"'
        // node.children = parsed "alt text"
        if (attributes.default) {
          const defaultAttrContent = attributes.default;
          // Regex to extract src (required) and an optional title in quotes
          const match = defaultAttrContent.match(/^([\S]+)(?:\s+"([^"]+)")?\s*$/);
          if (match) {
            audio_url = match[1];
            if (match[2]) {
              title = match[2];
            }
          }
        }

        if (audio_url) {
          // Transform the node into an <audio-player> element.
          // Astro should automatically map this to src/components/misc/AudioPlayer.astro
          // if the component is correctly named and placed.
          // The component file is `src/components/misc/AudioPlayer.astro`.
          // Astro's component auto-import expects kebab-case matching the component name.
          // So, <audio-player> should map to AudioPlayer.astro.
          node.type = "element";
          node.tagName = "audio-player"; // This should match the component filename AudioPlayer.astro
          node.properties = {
            src: audio_url,
          };
          if (title) {
            node.properties.title = title;
          }
          // Clear children derived from the directive, as AudioPlayer.astro handles its own content.
          node.children = [];
        } else {
          // Optional: leave a comment or a warning if parsing failed
          // For now, if audio_url is not found, the directive will effectively be removed or become an empty node.
          // Consider replacing with a text node indicating an error.
          // node.type = 'text';
          // node.value = `[Error processing !audio directive: Could not parse audio URL from "${attributes.default}"]`;
        }
      }
    });
  };
}

// Default export for Astro integration
export default rehypeComponentAudio;
